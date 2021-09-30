const User = require('../models/User')
const bcrypt = require('bcryptjs')

class UsersServices {
  async create({ user } = {}) {
    const { password } = user

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ ...user, password: hashedPassword })

    const userSaved = await newUser.save()
    return userSaved
  }
}

module.exports = UsersServices
