require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patients.js');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');
const recordModel = require('./models/recordModel.js');
const orgModel = require('./models/orgModel.js');
const notificationModel = require('./models/notificationModel.js');
const invoiceModel = require('./models/invoiceModel.js');
const Patient = require('./models/patientModel.js');
const Doctor = require('./models/doctorModel.js');
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
  const { patientID, title } = req.body;

  recordModel
    .create({ image: req.file.filename, patientID: patientID, title: title })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

app.post('/dupload', upload.single('file'), (req, res) => {
  const { patientID, doctorID, title } = req.body;
  recordModel
    .create({
      image: req.file.filename,
      patientID: patientID,
      doctorID: doctorID,
      title: title,
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

// delete a record
app.delete('/records/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such record' });
  }
  try {
    const record = await recordModel.findByIdAndDelete(id);
    if (!record) {
      return res
        .status(404)
        .json({ message: `cannot find any records with ID ${id}` });
    }
    res.status(200).json({ message: `deleted the following ${record}` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/invoice', (req, res) => {
  const {
    origin,
    recipient,
    dateSent,
    dateDue,
    subject,
    message,
    link,
    createdBy,
  } = req.body;
  invoiceModel
    .create({
      createdBy: createdBy,
      sender: origin,
      receiver: recipient,
      dateSent: dateSent,
      dateDue: dateDue,
      subject: subject,
      message: message,
      link: link,
    })
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

// Show invoices created by a user
app.get('/invoices/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ createdBy: id })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show invoices
app.get('/patient_invoices/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ receiver: id })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show unpaid invoices
app.get('/patient_invoices/unpaid/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ receiver: id, paid: false })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show pending invoices
app.get('/patient_invoices/pending/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ receiver: id, paid: true, paymentConfirmation: false })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show paid invoices
app.get('/patient_invoices/paid/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ receiver: id, paid: true, paymentConfirmation: true })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show sent invoices
app.get('/sent_invoices/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ createdBy: id })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show sent unpaid invoices
app.get('/sent_invoices/unpaid/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ createdBy: id, paid: false })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show sent pending invoices
app.get('/sent_invoices/pending/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ createdBy: id, paid: true, paymentConfirmation: false })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});

// Show sent paid invoices
app.get('/sent_invoices/paid/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .find({ createdBy: id, paid: true, paymentConfirmation: true })
    .then((invoices) => res.json(invoices))
    .catch((err) => console.log(err));
});
//////////////////////////////////////////////////////////////////////////////

// Get Sender Info
app.get('/patient_invoices/sender/:id', (req, res) => {
  const { id } = req.params;
  Doctor.find({ _id: id })
    .then((info) => res.json(info))
    .catch((err) => console.log(err));
});

// Mark Invoice as paid
app.patch('/patient_invoices/:id', (req, res) => {
  const { id } = req.params;
  invoiceModel
    .findByIdAndUpdate(id, { paid: true })
    .then((invoice) => res.json(invoice))
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

app.get('/orgs/', (req, res) => {
  orgModel
    .find({})
    .then((orgs) => res.json(orgs))
    .catch((err) => console.log(err));
});

app.get('/orgs/:id', (req, res) => {
  const { id } = req.params;

  orgModel
    .find({ _id: id })
    .then((orgs) => res.json(orgs))
    .catch((err) => console.log(err));
});

app.get('/orgs/patients/:id', (req, res) => {
  const { id } = req.params;

  Patient.find({ org: id })
    .then((orgs) => res.json(orgs))
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
