const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { apiKey } = require('../config')

class AuthServices {
  async login({ email, password }) {
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    if (!user.state) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    const token = jwt.sign({ id: user._id }, apiKey)

    return { user, token }
  }
}

module.exports = AuthServices
