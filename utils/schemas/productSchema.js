const Joi = require('@hapi/joi')
const mongoIdSchema = require('./mongoIdSchema')

const nameSchema = Joi.string().max(80)
const stateSchema = Joi.boolean()
const userSchema = mongoIdSchema
const priceSchema = Joi.number()
const categorySchema = mongoIdSchema
const descriptionSchema = Joi.string()
const availabilitySchema = Joi.boolean()
const imgSchema = Joi.string().uri()

const createProductSchema = Joi.object({
  name: nameSchema.required(),
  state: stateSchema.default(true),
  user: userSchema,
  price: priceSchema.default(0),
  category: categorySchema.required(),
  description: descriptionSchema,
  availability: availabilitySchema.default(true),
  img: imgSchema
})

const updateProductSchema = Joi.object({
  name: nameSchema,
  state: stateSchema,
  user: userSchema,
  price: priceSchema,
  category: categorySchema,
  description: descriptionSchema,
  availability: availabilitySchema,
  img: imgSchema
})

module.exports = {
  createProductSchema,
  updateProductSchema
}
