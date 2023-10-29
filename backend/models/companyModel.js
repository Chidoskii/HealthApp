const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const patientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter a first name'],
    },
    email: {
      type: String,
      required: [true, 'Enter email'],
    },
  },
  {
    timestamps: true,
  }
);
