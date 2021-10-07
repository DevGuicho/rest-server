const User = require('../models/User')
const boom = require('@hapi/boom')
const Role = require('../models/Role')
const Category = require('../models/Category')
const Product = require('../models/Product')

function existEmail(check = 'body') {
  return async (req, res, next) => {
    const { email } = req[check]
    const user = await User.findOne({ email })
    if (user) {
      next(boom.badRequest(`The email ${email} already exist`))
    }

    next()
  }
}

function existUser(check = 'body') {
  return async (req, res, next) => {
    const { id } = req[check]
    const user = await User.findById(id)
    if (!user) {
      next(boom.badRequest(`The user with ${id} doesn't exist`))
    }

    next()
  }
}

function existCategoryById(check = 'body', param) {
  return async (req, res, next) => {
    const id = req[check][param]
    const category = await Category.findById(id)
    if (!category) {
      next(boom.badRequest(`The category with id ${id} doesn't exist`))
    }

    next()
  }
}

async function existCategory(req, res, next) {
  const { name } = req.body
  const existCategory = await Category.findOne({ name: name.toUpperCase() })
  if (existCategory) {
    return next(boom.badRequest(`La categoria ${name} ya existe`))
  }
  next()
}

const existProductById = async (req, res, next) => {
  const { id } = req.params
  const existProduct = await Product.findById(id)
  if (!existProduct) {
    return next(boom.badRequest(`El producto con id ${id} no existe`))
  }
  next()
}

const existProduct = async (req, res, next) => {
  const { name } = req.body
  const existProduct = await Product.findOne({ name })
  if (existProduct) {
    return next(boom.badRequest(`El producto ${name} ya existe`))
  }
  next()
}

async function roleValidation(req, res, next) {
  const { rol } = req.body

  const rolesDB = await Role.find()
  if (rol && !rolesDB.includes(rol)) {
    next(boom.unauthorized('Invalid role'))
  }
  next()
}

module.exports = {
  existEmail,
  existUser,
  roleValidation,
  existCategoryById,
  existCategory,
  existProductById,
  existProduct
}
