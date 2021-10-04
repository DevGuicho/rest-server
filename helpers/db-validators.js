const Category = require('../models/Category')
const Product = require('../models/Product')
const Role = require('../models/Role')
const User = require('../models/User')

const isRoleValid = async (rol = '') => {
  const existRol = await Role.findOne({ rol })
  if (!existRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`)
  }
}

const existEmail = async (email = '') => {
  const existEmail = await User.findOne({ email })
  if (existEmail) {
    throw new Error(`El email ${email} ya esta registrado`)
  }
}

const existUser = async (id = '') => {
  const existUser = await User.findById(id)
  if (!existUser) {
    throw new Error(`El usuario con id ${id} no existe`)
  }
}

const existCategory = async (name = '') => {
  const existCategory = await Category.findOne({ name: name.toUpperCase() })
  if (existCategory) {
    throw new Error(`La categoria ${name} ya existe`)
  }
}

const existCategoryById = async (id = '') => {
  const existCategory = await Category.findById(id)
  if (!existCategory) {
    throw new Error(`La categoria ${id} no existe`)
  }
}

const existProduct = async (name = '') => {
  const existProduct = await Product.findOne({ name })
  if (existProduct) {
    throw new Error(`El producto ${name} ya existe`)
  }
}

const existProductById = async (id = '') => {
  const existProduct = await Product.findById(id)
  if (!existProduct) {
    throw new Error(`El producto con id ${id} no existe`)
  }
}

const existCollection = async (collection = '') => {
  const allowedCollections = ['users', 'categories', 'products', 'roles']
  if (!allowedCollections.includes(collection)) {
    throw new Error(`Las colecciones permitidas son : $${allowedCollections}`)
  }
}

module.exports = {
  isRoleValid,
  existEmail,
  existUser,
  existCategory,
  existCategoryById,
  existProduct,
  existProductById,
  existCollection
}
