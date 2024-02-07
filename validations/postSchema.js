const Joi = require('joi');

const postCreateType = Joi.object({
    
    content: Joi.string().required(),
  });

  module.exports= postCreateType;
  