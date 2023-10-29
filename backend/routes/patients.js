const express = require('express');
const {
  createPatient,
  getAllPatients,
  getOnePatient,
  deletePatient,
  updatePatient,
  loginPatient,
  signupPatient,
} = require('../controllers/patientController');
const cors = require('cors');

const router = express.Router();
router.use(express.json());
router.use(cors());

// login route
router.post('/patient_login', loginPatient);

// sign-up route
router.post('/patient_signup', signupPatient);

// get all of the patients
router.get('/', getAllPatients);

// get a single patient
router.get('/:id', getOnePatient);

// create a new patient
router.post('/', createPatient);

// delete a patient
router.delete('/:id', deletePatient);

// update a patient
router.patch('/:id', updatePatient);

module.exports = router;
