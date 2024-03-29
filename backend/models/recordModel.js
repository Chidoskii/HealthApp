const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      required: [true, 'Enter a title'],
    },
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
