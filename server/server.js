require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connect = require('./db/connecdb');
const router = require('./routes/route');

const app = express();

// middlewares

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by'); // less hackers know about our stack
app.use('/api', router);

const port = 5000;
const dbURI = process.env.MONGO_URI;

// HTTP routes
app.get('/', (req, res) => {
  res.status(201).json('Home GET request.');
});

const start = async () => {
  try {
    connect(dbURI)
      .then(() => {
        app.listen(port, () =>
          console.log(`App started listening at port ${port}`)
        );
      })
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

start();
