const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const patientSchema = mongoose.Schema(
  {
    patientID: {
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
    email: {
      type: String,
      required: [true, 'Enter email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Enter a password'],
    },
    role: {
      type: String,
    },
    groupID: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// static signup method
patientSchema.statics.signup = async function (fname, lname, email, password) {
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
    throw Error('Email already in use');
  }

  const crystals = await bcrypt.genSalt(10);
  const hashish = await bcrypt.hash(password, crystals);

  const patient = await this.create({ fname, lname, email, password: hashish });

  return patient;
};

// static login method
patientSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error('Fill in all fields');
  }

  const patient = await this.findOne({ email });

  if (!patient) {
    throw Error('Invalid email/password');
  }

  const match = await bcrypt.compare(password, patient.password);

  if (!match) {
    throw Error('Invalid email/password');
  }

  return patient;
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
