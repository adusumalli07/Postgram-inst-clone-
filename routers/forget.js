const express = require('express');

const router = express.Router();

const passwordForgot = require('../controllers/passwordForgot');

router.post('/', passwordForgot);

module.exports=router;