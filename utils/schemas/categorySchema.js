const Joi = require('@hapi/joi')
const mongoIdSchema = require('./mongoIdSchema')

const nameSchema = Joi.string().max(80)
const stateSchema = Joi.boolean()
const userSchema = mongoIdSchema

const createCategorySchema = Joi.object({
  name: nameSchema.required(),
  state: stateSchema.default(true),
  user: userSchema
})

const updateCategorySchema = Joi.object({
  name: nameSchema,
  state: stateSchema,
  user: userSchema
})

module.exports = { createCategorySchema, updateCategorySchema }
