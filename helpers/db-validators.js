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

module.exports = { isRoleValid, existEmail }
