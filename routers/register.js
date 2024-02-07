const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const verifytoken = require('../middlewares/verifytoken');
const isAdmin = require('../middlewares/isAdmin');
const { userSchema, userUpdate } = require('../validations/usersSchema');
const { transporter } = require('../helpers/node-mailer');
const Joi = require('joi');


const router = express.Router();

//All Users
router.get('/all', async (req, res) => {
try {
  
  //Pagination
  const page = parseInt(req.query.page)*1 || 1;
  const limit = parseInt(req.query.limit)*1 || 1;

  const startIndex = (page-1)*limit;

  const users = await User.find().skip(startIndex).limit(limit);
        
  // Count total number of users
  const totalUsers = await User.countDocuments();

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / limit);

  res.status(200).json({ 
      StatusCode: "200",
      message: "All Users", 
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsers,
      payload: users 
  });
} catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
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

  const { error } = await userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ statusCode:"400",error: error.details[0].message });
    }
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({StatusCode: "400",message: "User already registered"});

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    isAdmin : req.body.isAdmin || false
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = await user.generateAuthToken();
  
  let mailOptions = {
    from: '<adusumalli07@gmail.com>',
    to: 'arknaidu47@gmail.com',
    subject: 'Postgram Registration ...',
    text: JSON.stringify({
      StatusCode: '200',
      message: 'Registered Successfully...',
      payload: user,
      }),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return res.status(500).json({ StatusCode: "500", message: 'Error sending an email' });
      }
      const response = {
        StatusCode: "200",
        message: "Registered Successfully & sent an Email.",
        payload: user,
        token,
        emailResponse: `Email sent: ${info.response}`,
      };
    
      res.status(200).json(response);
    });
});

//Registering bulk Users
router.post('/bulkregister',[verifytoken,isAdmin], async (req, res) => {
  const { error } = await Joi.array().items(userSchema).validate(req.body);

  if (error) {
    return res.status(400).json({ statusCode:"400",error: error.details[0].message });
  }

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
    const token = await newUser.generateAuthToken();
    users.push(newUser,token);
  }
  // generate a token for each user and send the users array as the response
  //res.status(201).json({ StatusCode: "201",message: "All Users are Registered Succesfully ", users });
  
  let mailOptions = {
    from: '<adusumalli07@gmail.com>',
    to: 'arknaidu47@gmail.com',
    subject: 'Postgram Registration ...',
    text: JSON.stringify({
      StatusCode: '200',
      message: 'All Registerations are Successfull...',
      payload: users,
      }),
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return res.status(500).json({ StatusCode: "500", message: 'Error sending an email' });
      }
      const response = {
        StatusCode: "200",
        message: "All Users are Registered Succesfully & sent an Email.",
        payload: users,
        token,
        emailResponse: `Email sent: ${info.response}`,
      };
    
      res.status(200).json({StatusCode:"200",payload:response});
    });
});

//Updating a User/:id 
router.patch('/update/:id', async (req, res) => {
  try {
    const { error } = await userUpdate.validate(req.body);

  if (error) {
    return res.status(400).json({ statusCode:"400",error: error.details[0].message });
    }
    const user = await User.findById(req.params.id);
    const updateFields={};
    if (user.username != null) {
      updateFields.name = user.username;
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

    let mailOptions = {
      from: '<adusumalli07@gmail.com>',
      to: 'arknaidu47@gmail.com',
      subject: 'Postgram Registration ...',
      text: JSON.stringify({
        StatusCode: '200',
        message: 'Updated Successfully...',
        payload: users,
        }),
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return res.status(500).json({ StatusCode: "500", message: 'Error sending an email' });
        }
        const res = {
          StatusCode: "200",
          message: "Updated Succesfully & sent an Email.",
          payload: response,
          token,
          emailResponse: `Email sent: ${info.res}`,
        };
      
        res.status(200).json({statusCode:"200",payload:res});
      });
  } catch (err) {
    res.status(400).json({StatusCode: "400", message: err.message });
  }
});

//Removing a User/:id
router.delete('/delete/:id', async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    const response =await user.deleteOne();
    res.status(200).json({ message: 'User deleted', statusCode:200, payload: response });
  } catch (err) {
    res.status(500).json({ StatusCode: "500",message: err.message });
  }
});

//Removing all Users
router.delete('/deleteall',[verifytoken,isAdmin], async (req, res) => { 
  try {
    const user = await User.findById(req.params.id);
    await User.deleteMany({})
    res.status(200).json({StatusCode: "200",message: "All users removed successfully",payload:user});
  } catch (err) {
    res.status(500).json({ StatusCode: "500",message: err.message });
  }
});


module.exports=router;