const Joi = require('joi');

  const postComments = Joi.object({

    comment: Joi.string().required()
});


module.exports=  postComments;