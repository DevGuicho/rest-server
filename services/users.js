const User = require('../models/User')
const bcrypt = require('bcryptjs')

class UsersServices {
  async getUsers({ limit = 5, offset = 0 } = {}) {
    const query = { state: true }

    const [users, total] = await Promise.all([
      User.find(query).limit(limit).skip(offset),
      User.countDocuments(query)
    ])
    return { users, total }
  }

  async get({ id } = {}) {
    const user = await User.findById(id)
    return user
  }

  async create({ user } = {}) {
    const { password } = user

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ ...user, password: hashedPassword })

    const userSaved = await newUser.save()
    return userSaved
  }

  async update({ id, user } = {}) {
    const { password, google, ...updateUser } = user

    if (password) {
      updateUser.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateUser, {
      new: true
    })

    return updatedUser
  }

  async delete({ id }) {
    const userDeleted = User.findByIdAndUpdate(
      id,
      { state: false },
      { new: true }
    )
    return userDeleted
  }
}

module.exports = UsersServices
