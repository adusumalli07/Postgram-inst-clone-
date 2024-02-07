
const User = require('../models/users');

const { sendOtpEmail } = require('../helpers/nodemailer');

module.exports = async(req, res) => {
    try {

      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ StatusCode:"404",error: 'Email id does not found' });
      }
  
      const otp = `${Math.floor(1000+Math.random()*9000)}`;
      user.resetPasswordOtp=otp;
      const expires = Date.now() + 600000; // 10 minutes
      user.resetPasswordExpires=expires;
      await user.save();
    
      sendOtpEmail(user.email,otp);
      //console.log(user.email);
 
      res.status(200).json({ StatusCode: "200",message: 'OTP email sent'});
    } catch (error) {
      res.status(500).json({ StatusCode: "500",error: 'Server error' });
    }
  }