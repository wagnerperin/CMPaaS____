const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');
const Joi = require('joi');

//UserSchema for persistence pourpose
const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    select: false
  },
  salt: {
    type: String,
    select: false
  },
  userType: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, { timestamps: true });

UserSchema.methods.hashPassword = function() {
  this.salt = randomBytes(16).toString('hex');
  this.password = pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.hashPassword();
  }
  next();
});

mongoose.model('User', UserSchema);

//UserValidationSchema for persistence pourpose
const UserValidationSchema = Joi.object({
  name: Joi.string().trim().regex(/^[A-Z]+ [A-Z]+$/i).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/).required()
});

module.exports = app => UserValidationSchema;