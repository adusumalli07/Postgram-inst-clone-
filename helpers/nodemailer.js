
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "adusumalli07@gmail.com",
      pass: "mkkt ugje cnwi mfxn",
    }
});

const sendOtpEmail = (email,otp) => {
  const mailOptions = {
    from: "adusumalli07@gmail.com",
    to: email,
    subject: 'Password Reset OTP',
    html: `You have requested to reset your password. Please enter the following OTP to complete the process: <b>${otp}</b>`
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = { transporter, sendOtpEmail };