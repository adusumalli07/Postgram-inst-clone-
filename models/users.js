const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
         type: String,
         required: true,
         minlength: 3,
         maxlength: 15
    },
    password: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 500 
    },
    email: {
        type: String, 
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    tokens: [{
      token: {
          type: String,
          required: true 
      }
  }]
 
  });

  userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_KEY, { expiresIn: '1h' });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  }
  
  const User = mongoose.model('User', userSchema);

  module.exports=User;