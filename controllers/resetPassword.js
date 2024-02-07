const bcrypt = require('bcrypt');
const User = require('../models/users');

async function validateOTP(email, otp) {
    const user = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });
    return !!user;
}

module.exports = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email, resetPasswordOtp: otp, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ StatusCode: "400", error: 'Invalid or expired OTP' });
        }

        const isValidOTP = await validateOTP(email, otp);

        if (!isValidOTP) {
            return res.status(400).json({ StatusCode: "400", error: 'Invalid or expired OTP' });
        }

        // Update the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Respond to the client once after successful OTP validation and password update
        res.status(200).json({ StatusCode: "200", message: 'OTP validated successfully and password updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ StatusCode: "500", error: 'Server error' });
    }
}
