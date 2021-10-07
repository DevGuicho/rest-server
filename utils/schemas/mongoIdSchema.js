const Joi = require('@hapi/joi')

const mongoIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message('Invalid id format')

module.exports = mongoIdSchema
