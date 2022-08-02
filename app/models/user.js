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
      default: 'user',
      select: false
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

  userSchema.methods.isValidPassword = function(password) {
    const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.password === hash;
  };

  mongoose.model('User', userSchema);

  //userValidationSchema for persistence pourpose
  const userValidationSchema = Joi.object({
    name: Joi.string().trim().regex(/^(?:[\p{Lu}&&[\p{IsLatin}]])(?:(?:')?(?:[\p{Ll}&&[\p{IsLatin}]]))+(?:\-(?:[\p{Lu}&&[\p{IsLatin}]])(?:(?:')?(?:[\p{Ll}&&[\p{IsLatin}]]))+)*(?: (?:(?:e|y|de(?:(?: la| las| lo| los))?|do|dos|da|das|del|van|von|bin|le) )?(?:(?:(?:d'|D'|O'|Mc|Mac|al\-))?(?:[\p{Lu}&&[\p{IsLatin}]])(?:(?:')?(?:[\p{Ll}&&[\p{IsLatin}]]))+|(?:[\p{Lu}&&[\p{IsLatin}]])(?:(?:')?(?:[\p{Ll}&&[\p{IsLatin}]]))+(?:\-(?:[\p{Lu}&&[\p{IsLatin}]])(?:(?:')?(?:[\p{Ll}&&[\p{IsLatin}]]))+)*))+(?: (?:Jr\.|II|III|IV))?$/i).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/).required()
  });

  //userAuthValidationSchema for persistence pourpose
  const userAuthValidationSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}/).required()
  });

  return {userAuthValidationSchema, userValidationSchema};
}
