const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const adminSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, 'Enter a first name'],
    },
    lname: {
      type: String,
      required: [true, 'Enter a last name'],
    },
    mname: {
      type: String,
    },
    sffx: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Enter email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
    },
  },
  {
    timestamps: true,
  }
);

// static signup method
adminSchema.statics.signup = async function (fname, lname, email, password) {
  // validation
  if (!email || !password) {
    throw Error('Fill in all fields');
  }
  if (!validator.isEmail(email)) {
    throw Error('Enter a valid email');
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password must contain: A-Z a-z 0-9 and a special character');
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Try using a different email');
  }

  const crystals = await bcrypt.genSalt(10);
  const hashish = await bcrypt.hash(password, crystals);

  const admin = await this.create({ fname, lname, email, password: hashish });

  return admin;
};

// static login method
adminSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error('Fill in all fields');
  }

  const admin = await this.findOne({ email });

  if (!admin) {
    throw Error('Invalid email/password');
  }

  const match = await bcrypt.compare(password, admin.password);

  if (!match) {
    throw Error('Invalid email/password');
  }

  return admin;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
