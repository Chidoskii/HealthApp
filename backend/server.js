require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patients.js');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(
    '***********************************',
    '\n',
    'route: ',
    req.path,
    '\n',
    'method: ',
    req.method,
    '\n',
    '***********************************'
  );
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Hello my good friend!');
});

app.use('/patients', patientRoutes);
app.use('/admins', adminRoutes);
app.use('/doctors', doctorRoutes);

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log('Connected!');
    app.listen(process.env.PORT, () => {
      console.log(`Node API app is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
