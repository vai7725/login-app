require('dotenv').config();

const nodemailer = require('nodemailer');
const mailGen = require('mailgen');

const nodeConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_ADDRESS, // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

const mailGenerator = new mailGen({
  theme: 'default',
  product: {
    name: 'mailGen',
    link: 'https://mailgen.js/',
  },
});

const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  // body of the email
  var email = {
    body: {
      name: username,
      intro:
        text ||
        `Welcome to MERN app where you've logged in and making it better.`,
      outro: 'Thank you.',
    },
  };

  var emailBody = mailGenerator.generate(email);

  let message = {
    from: process.env.EMAIL_ADDRESS,
    to: userEmail,
    subject: subject || 'Signup successfull.',
    html: emailBody,
  };

  transporter
    .sendMail(message)
    .then(() =>
      res.status(200).json({ msg: 'You should recieve an email from us.' })
    )
    .catch((error) => res.status(500).json({ error }));
};

module.exports = registerMail;
