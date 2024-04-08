const { default: mongoose } = require('mongoose');
const Admin = require('../models/adminModel');
const Colleague = require('../models/colleagueModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: '1d' });
};

// login admin
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);

    // create token
    const token = createToken(admin._id);
    res.status(200).json({ email, token });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// signup admin
const signupAdmin = async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    const admin = await Admin.signup(fname, lname, email, password);

    // create token
    const token = createToken(admin._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single admin
const getOneAdmin = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such admin' });
  }
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get a single admin by email
const getAdmin = async (req, res) => {
  try {
    const { email } = req.params;

    const admins = await Admin.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// create a new admin
const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(200).json(admin);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
  }
};

// delete a admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such admin' });
  }
  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res
        .status(404)
        .json({ message: `cannot find any admins with ID ${id}` });
    }
    res.status(200).json({ message: `deleted the following ${admin}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update a admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such admin' });
  }
  try {
    const admin = await Admin.findByIdAndUpdate(id, req.body);
    if (!admin) {
      return res
        .status(404)
        .json({ message: `cannot find any admins with ID ${id}` });
    }
    const updatedAdmin = await Admin.findById(id);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// show patients
const showMyColleagues = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const relations = await Colleague.find({ adminID: id }).sort({
      createdAt: -1,
    });

    res.status(200).json(relations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getOneAdmin,
  deleteAdmin,
  updateAdmin,
  signupAdmin,
  loginAdmin,
  getAdmin,
  showMyColleagues,
};
