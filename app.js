const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const registerRouter = require('./routers/register');
const loginRouter = require('./routers/login');
const logoutRouter = require('./routers/logout');
const postsRouter = require('./routers/post');
const postActivitiesRouter = require('./routers/postActivities');
const passwordForgot = require('./routers/forget');
const resetPassword = require('./routers/resetPassword');


mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
  
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
  });
  
  mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });
  
const app = express();

app.use(bodyParser.json());

app.use('/users',registerRouter);
app.use('/login',loginRouter);
app.use('/forgot-password',passwordForgot);
app.use('/reset-password',resetPassword);
app.use('/logout',logoutRouter);
app.use('/posts',postsRouter);
app.use('/post',postActivitiesRouter);

app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}`));