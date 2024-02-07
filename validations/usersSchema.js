const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(5).max(500).required(),
  email: Joi.string().email().min(5).max(50).required(),
  isAdmin: Joi.boolean().optional()
});

const userUpdate = Joi.object({
  username: Joi.string().min(3).max(15).optional(),
  password: Joi.string().min(5).max(500).optional(),
  email: Joi.string().email().min(5).max(50).optional(),
  isAdmin: Joi.boolean().optional()
});//.or('username', 'password', 'email', 'isAdmin').forbidden();

module.exports = { userSchema,userUpdate };



