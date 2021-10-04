const jwt = require('jsonwebtoken')
const { apiKey } = require('../config')
const User = require('../models/User')

async function jwtValidation(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      error: 'Token no valido'
    })
  }
  try {
    const { id } = jwt.verify(token, apiKey)
    const user = await User.findById(id)
    if (!user.state) {
      return res.status(401).json({ error: 'Token no valido' })
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token no valido' })
  }
}

module.exports = { jwtValidation }
