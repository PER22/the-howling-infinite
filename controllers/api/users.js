const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const postmark = require("postmark");
const User = require('../../models/user');
const { body, validationResult } = require('express-validator');

const validateAndSanitizeSignup = [
  body('name').notEmpty().trim().escape(),
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
      errors.array().forEach((error)=>{console.log(error);});
      return res.status(405).json({ errors: errors.array() });
    }
    // Add the user to the db
    const user = await User.create(req.body);

    //overwrite isAdmin and isVerified for security
    user.isAdmin = false; //There will be one administrator and I will change that value by hand in the database.
    user.isVerified = false; 
    //create verification token and store in user object
    user.verificationToken = crypto.randomBytes(32).toString('hex'); 
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24); // token valid for 24 hours
    user.verificationExpires = expirationTime;
    await user.save();
    var client = new postmark.ServerClient(process.env.POSTMARK_KEY);
    await client.sendEmail({
      "From": `${process.env.EMAIL_FROM}`,
      "To": `${user.email}`,
      "Subject": "Verify your email address to log into The-Howling-Infinite.com",
      "HtmlBody": `Here is your verification link: <a href="${process.env.BASE_URL}/verify-email?token=${user.verificationToken}">Verify email address</a>`,
      "TextBody": `Copy and paste this link into your URL bar to verify your email address: ${process.env.BASE_URL}/reset-password?token=${user.verificationToken}`,
      "MessageStream": "outbound"
    });
    return res.status(201).json({message: "Account created."});
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
}

async function verifyEmail(req, res){
  try {
    const token = req.body.token;
    const user = await User.findOne({ verificationToken: token });

    //If token is expired, send a new one, and update the user document in database.
    if (!user || user.verificationExpires < new Date()) {
      const response = await resendVerification(user);
      return res.status(response.status).json({error: "The verification link you clicked has expired. A new one has been sent to your email."});
    }
    
    // Otherwise, set the user as verified, 
    user.isVerified = true;
    // and clear the verification token and expiration
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Create and send the JWT to the client, automatically logging them in.
    res.status(200).json({message: "You are verified, and can now log in."});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function resendVerification(user){
  if (!user) {
    console.log("User not found");
    throw new Error('User not found');
  }  
  try{
    user.verificationToken = crypto.randomBytes(32).toString('hex'); 
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24); // token valid for 24 hours
    user.verificationExpires = expirationTime;
    await user.save();
    var client = new postmark.ServerClient(process.env.POSTMARK_KEY);
    await client.sendEmail({
      "From": process.env.EMAIL_FROM,
      "To": `${user.email}`,
      "Subject": "Verify your email address to log into The-Howling-Infinite.com",
      "HtmlBody": `Here is your verification link: <a href="${process.env.BASE_URL}/verify-email?token=${user.verificationToken}">Verify email address</a>. It will be valid for 24 hours. If you need a new one, click this link anyway and the new one will be sent.`,
      "TextBody": `Copy and paste this link into your URL bar to verify your email address: ${process.env.BASE_URL}/reset-password?token=${user.verificationToken}`,
      "MessageStream": "outbound"
    });
    return {status: 201, message: `A new verification email has been sent to ${user.email}.`};
  }catch(err){
    throw(err);
  }
}

const validateAndSanitizeLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().trim().escape(),
];

async function login(req, res) {
  console.log("Entering login()");
  try {
    // Validate and sanitize the login form data
    await Promise.all(validateAndSanitizeLogin.map((middleware) => middleware.run(req)));
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Email address is incorrectly formatted." });
    }

    // Find the user by their email address
    const user = await User.findOne({email: req.body.email});
    if (!user){ 
      console.log("User not found.");
      return res.status(401).json({error: "User not found."});
    }
    if(!user.isVerified){
      return res.status(402).json({error: "Email address not verified."});
    }
    if (user.failedLoginAttempts >= 5) {
      user.failedLoginAttempts+=1;
      await user.save();
      return res.status(429).json({error: "Account locked. Please reset your password."});
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      user.failedLoginAttempts+=1;
      await user.save();
      return res.status(403).json({error: "Password doesn't match."});
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    await user.save();
    return res.json( createJWT(user) );
  } catch (err){
    return res.status(404).send({error: err.message});
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
  console.log("Entering sendPasswordResetEmail()");
  try{
    console.log("req.body", req.body);
    await body('email').isEmail().normalizeEmail().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Email address is incorrectly formatted." });
    }
    console.log(req.body.email);
    const user = await User.findOne({email : req.body.email});
    if(!user){
      console.log("User not found.");
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
      "From": "patrick@blackcatweb.dev",
      "To": `${req.body.email}`,
      "Subject": "Password Reset from The-Howling-Infinite.com",
      "HtmlBody": `Here is your password reset link: <a href="${process.env.BASE_URL}/reset-password?token=${resetToken}">Reset Password</a>`,
      "TextBody": `Copy and paste this link into your URL bar to reset your password: http://www.the-howling-infinite.com/reset-password?token=${resetToken}`,
      "MessageStream": "outbound"
    });
    return res.status(200).json({message: "Successfully sent password reset email."});
  }catch(err){
    console.log(err);
    return res.status(500).json({error: err});
  }
}

async function performPasswordReset(req, res){
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      // console.log("Failed to find user");
      return res.status(400).json({error:'Invalid token.'});
    } 
    // console.log("Found the requested user!");
    const now = new Date();
    if (user.passwordResetExpires < now) {
      // console.log("Token is expired");
      return res.status(400).send({error:'Token has expired.'});
    } 
    await body('newPassword').isLength({ min: 8 }).trim().escape().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Password does not meet minimum length requirements." });
    }

    // console.log("New password! :", newPassword);
    // console.log("Old password hash:", user.password);
    user.password = newPassword;
    // Clear the reset token and expiration date
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Clear the .failedLoginAttempts
    user.failedLoginAttempts = 0;
    // console.log("Cleared reset token from user document!")
    // Save the updated user back to the database
    await user.save();
    // console.log("Saved user document!");

    // Send a success response
    res.status(200).send({message:'Password has been reset successfully.'});

  } catch (error) {
    console.error(error);
    res.status(500).send({error: 'An error occurred while resetting the password.'});
  }
};

module.exports = {
  create,
  verifyEmail,
  login,
  sendPasswordResetEmail,
  performPasswordReset
};