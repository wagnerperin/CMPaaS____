module.exports = app => {
  const mongoose = require('mongoose');
  const {randomBytes, pbkdf2Sync} = require('crypto');
  const Joi = require('joi');

  //userSchema for persistence pourpose
  const userSchema = new mongoose.Schema({
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
  }, {timestamps: true});

  userSchema.methods.hashPassword = function() {
    this.salt = randomBytes(16).toString('hex');
    this.password = pbkdf2Sync(this.password, this.salt, 1000, 64, 'sha512').toString('hex');
  };

  userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
      this.hashPassword();
    }
    next();
  });

  mongoose.model('User', userSchema);

  //userValidationSchema for persistence pourpose
  const userValidationSchema = Joi.object({
    name: Joi.string().trim().regex(/^[A-Z]+ [A-Z]+$/i).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/).required()
  });

  return userValidationSchema;
}
