const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const doctorSchema = mongoose.Schema(
  {
    doctorID: {
      type: Number,
    },
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
doctorSchema.statics.signup = async function (fname, lname, email, password) {
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

  const doctor = await this.create({ fname, lname, email, password: hashish });

  return doctor;
};

// static login method
doctorSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error('Fill in all fields');
  }

  const doctor = await this.findOne({ email });

  if (!doctor) {
    throw Error('Invalid email/password');
  }

  const match = await bcrypt.compare(password, doctor.password);

  if (!match) {
    throw Error('Invalid email/password');
  }

  return doctor;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
