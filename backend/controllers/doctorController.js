const { default: mongoose } = require('mongoose');
const Doctor = require('../models/doctorModel');
const Provider = require('../models/providerModel');
const Patient = require('../models/patientModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '1d' });
};

// login doctor
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.login(email, password);

    // create token
    const token = createToken(doctor._id);
    res.status(200).json({ email, token });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// signup doctor
const signupDoctor = async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    const doctor = await Doctor.signup(fname, lname, email, password);

    // create token
    const token = createToken(doctor._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}).sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single doctor
const getOneDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such doctor' });
  }
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single doctor by email
const getDoctor = async (req, res) => {
  try {
    const { email } = req.params;

    const doctors = await Doctor.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(200).json(doctor);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// delete a doctor
const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such doctor' });
  }
  try {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res
        .status(404)
        .json({ message: `cannot find any doctors with ID ${id}` });
    }
    res.status(200).json({ message: `deleted the following ${doctor}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update a doctor
const updateDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such doctor' });
  }
  try {
    const doctor = await Doctor.findByIdAndUpdate(id, req.body);
    if (!doctor) {
      return res
        .status(404)
        .json({ message: `cannot find any doctors with ID ${id}` });
    }
    const updatedDoctor = await Doctor.findById(id);
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// show patients
const showMyPatients = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const patrons = [];

  try {
    const relations = await Provider.find(
      { doctorID: id },
      { patientID: 1 }
    ).sort({
      createdAt: -1,
    });

    res.status(200).json(relations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getOneDoctor,
  deleteDoctor,
  updateDoctor,
  signupDoctor,
  loginDoctor,
  getDoctor,
  showMyPatients,
};
