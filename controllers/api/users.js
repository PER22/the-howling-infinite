const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const postmark = require("postmark");
const User = require('../../models/user');
const Profile = require('../../models/profile')
const { body, validationResult } = require('express-validator');

const validateAndSanitizeSignup = [
  body('name').notEmpty().trim().escape(),
  body('username').notEmpty().trim().escape().custom(async (value) => {
    const existingUser = await User.findOne({ username: value });
    if (existingUser) {
      return Promise.reject('Username already exists');
    }
    return true;
  }),
  body('email').isEmail().normalizeEmail().custom(
    async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        return Promise.reject('Email already exists.');
      }
      return true;
    }),
  body('password').isLength({ min: 8 }).trim().escape(),
];

async function create(req, res) {
  try {
    //validate and sanitize user creation form data
    await Promise.all(validateAndSanitizeSignup.map((middleware) => middleware.run(req)));
    // Check for validation errors
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {
      return res.status(405).json({ errors: errors.array() });
    }
    // Add the user to the db
    const user = await User.create(req.body);
    //Create a profile with the user
    const profile = new Profile({user: user._id})
    await profile.save();
    user.profile = profile._id;
    await user.save();
    // token will be a string
    const token = createJWT(user);
    // Yes, we can serialize a string
    res.json(token);
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
}

const validateAndSanitizeLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().trim().escape(),
];

async function login(req, res) {
  try {
    // Validate and sanitize the login form data
    await Promise.all(validateAndSanitizeLogin.map((middleware) => middleware.run(req)));
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by their email address
    const user = await User.findOne({email: req.body.email});
    if (!user){ throw new Error("User not found");}
    // Check if the password matches
    const match = bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    res.json( createJWT(user) );
  } catch {
    res.status(400).json('Login failed. Try again.');
  }
}

function createJWT(user) {
  return jwt.sign(
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

async function sendPasswordResetEmail(req, res){
  try{
    const user = await User.findOne({email : req.body.email});
    if(!user){
      return res.status(404).json({error: `User with email address '${req.body.email}' not found.`});
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1); // token valid for 1 hour
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = expirationTime;
    await user.save(); // save the updated user document

    var client = new postmark.ServerClient(process.env.POSTMARK_KEY);
    await client.sendEmail({
      "From": "preil001@ucr.edu",
      "To": `${req.body.email}`,
      "Subject": "Password Reset from The-Howling-Infinite.com",
      "HtmlBody": `Here is your password reset link: <a href="http://localhost:3000/reset-password?token=${resetToken}">Reset Password</a>`,
      "TextBody": `Copy and paste this link into your URL bar to reset your password: http://localhost:3000/reset-password?token=${resetToken}`,
      "MessageStream": "outbound"
    });
    return res.status(200).json("Successfully sent password reset email.")
  }catch(err){
    return res.status(500).json({error: err});
  }
}

async function performPasswordReset(req, res){
  const { token, newPassword } = req.body;

  try {
    // Find the user by reset token
    const user = await User.findOne({ passwordResetToken: token });

    if (!user) {
      return res.status(400).send('Invalid token.');
    }

    // Check if token is expired
    const now = new Date();
    if (user.passwordResetExpires < now) {
      return res.status(400).send('Token has expired.');
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, user.SALT_ROUNDS || 6);

    // Clear the reset token and expiration date
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user back to the database
    await user.save();

    // Send a success response
    res.status(200).send('Password has been reset successfully.');

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while resetting the password.');
  }
};

module.exports = {
  create,
  login,
  sendPasswordResetEmail,
  performPasswordReset
};