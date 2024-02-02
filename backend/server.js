require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');
const patientRoutes = require('./routes/patients.js');
const adminRoutes = require('./routes/admins');
const doctorRoutes = require('./routes/doctors');
const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const app = express();

// middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
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
/*
app.get('/', (req, res) => {
  res.send('Hello my good friend!');
});
*/

app.use('/patients', patientRoutes);
app.use('/admins', adminRoutes);
app.use('/doctors', doctorRoutes);

const conn = mongoose.createConnection(process.env.URI);
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('records');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'records',
        };
        resolve(fileInfo);
      });
    });
  },
});
const record = multer({ storage });

// @route GET /
// @desc Loads form
app.get('/', (req, res) => {
  res.render('index');
});

// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', record.single('file'), (req, res) => {
  //res.json({ file: req.file });
  res.redirect('/');
});

// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists',
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image',
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
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
