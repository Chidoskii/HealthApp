const express = require('express');
const {
  createDoctor,
  getAllDoctors,
  getOneDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  signupDoctor,
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
router.get('/:id', getOneDoctor);

// create a new doctor
router.post('/', createDoctor);

// delete a doctor
router.delete('/:id', deleteDoctor);

// update a doctor
router.put('/:id', updateDoctor);

module.exports = router;
