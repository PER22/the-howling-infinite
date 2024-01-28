const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    required: true
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
    defaultValue: false
  },
  isAdmin: {
    type: Boolean, 
    required: true,
    default: false,
    defaultValue: false
  },
  passwordResetToken: {type: String},
  passwordResetExpires: {type: Date},
  verificationToken: {type: String},
  verificationExpires: {type: Date},
  failedLoginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lastFailedLoginAttempt: {
    type: Date
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) { return next(); }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

module.exports = mongoose.model('User', userSchema);