const Joi = require('@hapi/joi')

const loginSchema = Joi.object({
  email: Joi.string().email().required,
  password: Joi.string().required()
})

module.exports = {
  loginSchema
}
