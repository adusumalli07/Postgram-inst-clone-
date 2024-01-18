const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const router = express.Router();

//All Users
router.get('/all', async (req, res) => {
try {
  const users = await User.find();
  res.status(200).json({ StatusCode: "200",message: "All Users",payload:users });


} catch (err) {
  res.status(505).json({ StatusCode: "505",message: err.message });
}
});


//User:Id
router.get('/:id', async (req, res) => { 
try {
  const user = await User.find({_id:req.params.id});
  res.status(200).json({StatusCode: "200",message: "User",payload:user});
  
} catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
}
});

//Registering a Single User
router.post('/register', async (req, res) => {
let user = await User.findOne({ email: req.body.email });
if (user) return res.status(400).json({StatusCode: "400",message: "User already registered"});

user = new User({
  username: req.body.username,
  email: req.body.email,
  password: req.body.password
});

const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt);
await user.save();

const token = await user.generateAuthToken();
res.status(200).json({ StatusCode: "200",message: "Registered Successfully", payload:user,token });
});

//Registering bulk Users
router.post('/bulkregister', async (req, res) => {
  const bulkusers = req.body;
  const users=[]
  for(let user of bulkusers){

    const salt = await bcrypt.genSalt(10);
    const password= await bcrypt.hash(user.password, salt);
      const newUser = new User({
      username:user.username,
      email: user.email,
      password: password
      });

    await newUser.save();
    users.push(newUser);
  }
  // generate a token for each user and send the users array as the response
  res.status(201).json({ StatusCode: "201",message: "All Users are Registered Succesfully ", users });
});

//Updating a User/:id 
router.patch('/update/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const updateFields={};
    if (user.username != null) {
      updateFields.name = user.name;
    }

    if (user.email != null) {
      updateFields.email = user.email;
    }

    if (user.password != null) {
      updateFields.password = user.password;
    }

    updateFields.updatedAt = new Date();  //cretedAt is autopolulated

    const response =  await User.updateOne({_id:req.params.id},{
        ...updateFields
    })
    
    res.status(200).json({StatusCode: "200",message: "User detailes are updated successfully",payload:response});
  } catch (err) {
    res.status(400).json({StatusCode: "400", message: err.message });
  }
});

//Removing a User/:id
router.delete('/delete/:id', async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    const response =await user.deleteOne();
    res.status(200).json({ message: 'User deleted', statusCode:200,payload: response });
  } catch (err) {
    res.status(500).json({ StatusCode: "500",message: err.message });
  }
});

//Removing all Users
router.delete('/deleteall', async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    await User.deleteMany({})
    res.status(200).json({StatusCode: "200",message: "All users removed successfully",payload:user});
  } catch (err) {
    res.status(500).json({ StatusCode: "500",message: err.message });
  }
});


module.exports=router;