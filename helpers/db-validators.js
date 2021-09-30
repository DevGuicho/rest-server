const Role = require('../models/Role')

const isRoleValid = async (rol = '') => {
  const existRol = await Role.findOne({ rol })
  if (!existRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`)
  }
}

module.exports = isRoleValid
