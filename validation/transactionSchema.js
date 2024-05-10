const Joi = require("joi");

const transactionSchema = Joi.object({
  date: Joi.string().required(),
  description: Joi.string().required(),
  amount: Joi.number().min(1).required(),
  category: Joi.string().required(),
  transactionType: Joi.string().required(),
});

module.exports = { transactionSchema };
