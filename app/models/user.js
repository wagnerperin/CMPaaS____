const mongoose = require('mongoose');
const { randomBytes, pbkdf2Sync } = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  salt: {
    type: String,
    select: false
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
