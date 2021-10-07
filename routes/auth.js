const express = require('express')
const jwt = require('jsonwebtoken')
const boom = require('@hapi/boom')

const AuthServices = require('../services/auth')
const UsersServices = require('../services/users')
const { apiKey } = require('../config')
const { loginSchema } = require('../utils/schemas/loginSchema')
const { createUserSchema } = require('../utils/schemas/userSchema')
const { existEmail, validationHandler } = require('../middlewares')

function authApi(app) {
  const router = express.Router()
  const authServices = new AuthServices()
  const usersServices = new UsersServices()
  app.use('/api/auth', router)

  router.post(
    '/login',
    validationHandler(loginSchema),
    async (req, res, next) => {
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
        next(boom.unauthorized(error))
      }
    }
  )

  router.post(
    '/sign-up',
    validationHandler(createUserSchema),
    existEmail(),
    async (req, res) => {
      const user = req.body
      console.log(apiKey)
      const userCreated = await usersServices.create({ user })
      const token = jwt.sign({ id: userCreated._id }, apiKey)

      res.json({
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      })
    }
  )
  /*   router.post(
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
  */
}

module.exports = authApi
