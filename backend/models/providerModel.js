const mongoose = require('mongoose');

const providerSchema = mongoose.Schema(
  {
    patientID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
