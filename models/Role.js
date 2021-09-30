const { Schema, model } = require('mongoose')

const RoleSchema = Schema({
  rol: {
    type: String,
    required: [true, 'El ro es obligatorio']
  }
})

module.exports = model('role', RoleSchema)
