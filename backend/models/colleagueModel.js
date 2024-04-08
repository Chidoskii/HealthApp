const mongoose = require('mongoose');

const colleagueSchema = mongoose.Schema(
  {
    adminID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    doctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    dName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Colleague = mongoose.model('Colleague', colleagueSchema);

module.exports = Colleague;
