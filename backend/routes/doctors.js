const express = require('express');
const {
  createDoctor,
  getAllDoctors,
  getOneDoctor,
  getDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  signupDoctor,
  showMyPatients,
} = require('../controllers/doctorController');
const cors = require('cors');

const router = express.Router();
router.use(express.json());
router.use(cors());

// login route
router.post('/doctor_login', loginDoctor);

// sign-up route
router.post('/doctor_signup', signupDoctor);

// get all of the doctors
router.get('/', getAllDoctors);

// get a single doctor
//router.get('/:id', getOneDoctor);

// get a admin from email
router.get('/:email', getDoctor);

// create a new doctor
router.post('/', createDoctor);

// delete a doctor
router.delete('/:id', deleteDoctor);

// update a doctor
router.patch('/:id', updateDoctor);

// show patients
router.get('/providers/:id', showMyPatients);

module.exports = router;
