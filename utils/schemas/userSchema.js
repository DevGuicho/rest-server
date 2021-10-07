const Joi = require('@hapi/joi')

const userIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .message('Invalid id format')

const nameSchema = Joi.string().max(80)
const emailSchema = Joi.string().email()
const passwordSchmea = Joi.string().min(8).max(30)
const imgSchema = Joi.string().uri()
const roleSchema = Joi.string()
const stateSchema = Joi.boolean()
const googleSchema = Joi.boolean()

const createUserSchema = Joi.object({
  name: nameSchema.required(),
  email: emailSchema.required(),
  password: passwordSchmea.required(),
  img: imgSchema,
  rol: roleSchema.required(),
  state: stateSchema,
  google: googleSchema
})
const updateUserSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchmea,
  img: imgSchema,
  rol: roleSchema,
  state: stateSchema,
  google: googleSchema
})

module.exports = {
  userIdSchema,
  createUserSchema,
  updateUserSchema
}
