const { default: mongoose } = require('mongoose');
const Patient = require('../models/patientModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '1d' });
};

// login patient
const loginPatient = async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.login(email, password);

    // create token
    const token = createToken(patient._id);
    res.status(200).json({ email, token });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// signup patient
const signupPatient = async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    const patient = await Patient.signup(fname, lname, email, password);

    // create token
    const token = createToken(patient._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single patient
const getOnePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such patient' });
  }
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single patient by email
const getPatient = async (req, res) => {
  try {
    const { email } = req.params;

    const patients = await Patient.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new patient
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(200).json(patient);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// delete a patient
const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such patient' });
  }
  try {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      return res
        .status(404)
        .json({ message: `cannot find any patients with ID ${id}` });
    }
    res.status(200).json({ message: `deleted the following ${patient}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update a patient
const updatePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such patient' });
  }
  try {
    const patient = await Patient.findByIdAndUpdate(id, req.body);
    if (!patient) {
      return res
        .status(404)
        .json({ message: `cannot find any patients with ID ${id}` });
    }
    const updatedPatient = await Patient.findById(id);
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getOnePatient,
  deletePatient,
  updatePatient,
  signupPatient,
  loginPatient,
  getPatient,
};
