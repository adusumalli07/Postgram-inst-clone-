const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "adusumalli07@gmail.com",
      pass: "mkkt ugje cnwi mfxn",
    }
  });
  
module.exports={ transporter }