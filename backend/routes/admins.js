const express = require('express');
const {
  createAdmin,
  getAllAdmins,
  getOneAdmin,
  deleteAdmin,
  updateAdmin,
  loginAdmin,
  signupAdmin,
  getAdmin,
} = require('../controllers/adminController');
const cors = require('cors');

const router = express.Router();
router.use(express.json());
router.use(cors());

// login route
router.post('/admin_login', loginAdmin);

// sign-up route
router.post('/admin_signup', signupAdmin);

// get all of the admins
router.get('/', getAllAdmins);

// get a single admin
//router.get('/:id', getOneAdmin);

// get a admin from email
router.get('/:email', getAdmin);

// create a new admin
router.post('/', createAdmin);

// delete a admin
router.delete('/:id', deleteAdmin);

// update a admin
router.patch('/:id', updateAdmin);

module.exports = router;
