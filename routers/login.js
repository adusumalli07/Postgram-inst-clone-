const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

router.post('/', async (req, res) => {

  const { email, password } = req.body;

  try {
  
  // Find the user associated with the email
  const user = await User.findOne({ email });     //email = req.body.email
 
  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ StatusCode: "401",error: 'Invalid email' });
  }
  // Check if the password is correct  
  const isMatch = await bcrypt.compare(password,user.password);

  // If the password is incorrect, return an error
  if (!isMatch) {
    return res.status(401).json({ StatusCode: "401",error: 'Invalid password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

  // Send the token to the client
  res.status(200).json({ StatusCode: "200", message: "Token generated successfully", payload:{token} });
  } catch (error) {

  res.status(500).json({ StatusCode: "500",error: 'Server error' });
  }
});



module.exports=router;