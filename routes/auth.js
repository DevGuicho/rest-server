const express = require('express')
const { body } = require('express-validator')
const googleVerify = require('../helpers/googleVerify')
const jwt = require('jsonwebtoken')

const handleValidate = require('../middlewares/handleValidation')
const User = require('../models/User')
const AuthServices = require('../services/auth')
const { apiKey } = require('../config')

function authApi(app) {
  const router = express.Router()
  const authServices = new AuthServices()
  app.use('/api/auth', router)

  router.post(
    '/login',
    body('email').isEmail().withMessage('El correro es obligatorio'),
    body('password').not().isEmpty().withMessage('Contraseña obligatoria'),
    handleValidate,
    async (req, res) => {
      const { email, password } = req.body

      try {
        const { user, token } = await authServices.login({ email, password })
        res.json({
          message: 'login',
          data: {
            user,
            token
          }
        })
      } catch (error) {
        res.status(400).json({
          error: error.message
        })
      }
    }
  )

  router.post(
    '/google',
    body('idToken').not().isEmpty(),
    handleValidate,
    async (req, res) => {
      const { idToken } = req.body

      try {
        const { name, email, picture } = await googleVerify({ token: idToken })
        let user = await User.findOne({ email })

        if (!user) {
          const data = {
            name,
            email,
            password: '00',
            img: picture,
            rol: 'USER_ROLE',
            google: true
          }
          user = new User(data)
          await user.save()
        }
        if (!user.state) {
          return res.status(401).json({
            error: 'Hable con el admin, usuario bloqueado'
          })
        }

        const token = jwt.sign({ id: user._id }, apiKey)
        res.json({
          message: 'User logged',
          data: {
            user,
            token
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  )
}

module.exports = authApi
