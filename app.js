const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const registerRouter = require('./routers/register');
const loginRouter = require('./routers/login');
const logoutRouter = require('./routers/logout');
const postRouter = require('./routers/post');

mongoose.connect("mongodb+srv://users:gKq4iNykZcgkhSGj@cluster0.plgsuop.mongodb.net/?retryWrites=true&w=majority")
.then( () => console.log("DB is Connected"))
.catch( err => console.log(err));

const port = 2020;
const app = express();

app.use(bodyParser.json());

app.use('/users',registerRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/posts',postRouter);

app.listen(port, () => console.log(`Server is running on ${port}`));