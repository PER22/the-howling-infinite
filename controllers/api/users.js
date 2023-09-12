const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
    console.log(err);
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

async function getUserByUsername(req,res){
    try{
      // Find the user by their username
      const user = await User.findOne({username: req.params.username});
      if (!user){ throw new Error(`Failed to find User with username ${req.params.username}`);}
      res.status(200).json(user);
    }catch(err){
      res.status(404).json({error: err})
    }
      
}

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = {
  create,
  login,
  getUserByUsername
};