const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shop@gmail.com',
    pass: 'app-password'
  }
});