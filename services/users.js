const User = require('../models/User')
const bcrypt = require('bcryptjs')

class UsersServices {
  async create({ user } = {}) {
    const { password, email } = user
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      throw new Error('El email ya existe')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ ...user, password: hashedPassword })

    const userSaved = await newUser.save()
    return userSaved
  }
}

module.exports = UsersServices
