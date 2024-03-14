require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patients.js');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');
const recordModel = require('./models/recordModel.js');
const notificationModel = require('./models/notificationModel.js');
const Patient = require('./models/patientModel.js');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const stripe = require('stripe')(
  'sk_test_51OtKU5LK0T54pFuRe9WBD3UEXIW8I5JtbwJvihQXwttIc0eG68ZT7Ye8j2UNmyB5AWasYYyMMttqFOD42ue6xG0Z00H0RnZFlA'
);

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
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
/*Welcome mssg (test)*/
app.get('/', (req, res) => {
  res.send('Hello my good friend!');
});

app.use('/patients', patientRoutes);
app.use('/admins', adminRoutes);
app.use('/doctors', doctorRoutes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { patientID } = req.body;

  recordModel
    .create({ image: req.file.filename, patientID: patientID })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.post('/dupload', upload.single('file'), (req, res) => {
  const { patientID, doctorID } = req.body;
  recordModel
    .create({
      image: req.file.filename,
      patientID: patientID,
      doctorID: doctorID,
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get('/get_images', (req, res) => {
  recordModel
    .find()
    .then((records) => res.json(records))
    .catch((err) => console.log(err));
});

app.get('/records/:id', (req, res) => {
  const { id } = req.params;

  recordModel
    .find({ patientID: id })
    .then((records) => res.json(records))
    .catch((err) => console.log(err));
});

app.post('/messenger', (req, res) => {
  const { mtitle, ugroup, uemail, mcontent } = req.body;
  notificationModel
    .create({
      sender: '65d696de8305820100ef32c4',
      senderGroup: 'doctors',
      title: mtitle,
      receiverGroup: ugroup,
      receiver: uemail,
      message: mcontent,
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.get('/get_notys/:email', (req, res) => {
  const { email } = req.params;
  notificationModel
    .find({ receiver: email })
    .then((records) => res.json(records))
    .catch((err) => console.log(err));
});

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

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
