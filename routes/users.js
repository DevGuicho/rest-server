const express = require('express')
const passport = require('passport')

const UsersServices = require('../services/users')
const {
  handleValidate,
  validateRoles,
  validationHandler,
  existEmail,
  existUser,
  roleValidation
} = require('../middlewares')
const {
  createUserSchema,
  userIdSchema,
  updateUserSchema
} = require('../utils/schemas/userSchema')

require('../utils/strategies/jwt')

function userApi(app) {
  const usersService = new UsersServices()
  const router = express.Router()

  app.use('/api/users', router)

  router.get('/', async (req, res) => {
    const { limit, offset } = req.query
    const { users, total } = await usersService.getUsers({
      limit: limit && Number(limit),
      offset: offset && Number(offset)
    })
    res.json({
      message: 'users listed',
      data: { users, total }
    })
  })
  router.get(
    '/:id',
    validationHandler(userIdSchema, 'params', 'id'),
    existUser('params'),
    handleValidate,
    async (req, res) => {
      const { id } = req.params
      const user = await usersService.get({ id })
      res.json({
        message: 'users listed',
        data: user
      })
    }
  )
  router.post(
    '/',
    validationHandler(createUserSchema),
    existEmail('body'),
    async (req, res) => {
      const { body: user } = req
      const userCreated = await usersService.create({ user })

      res.json({
        message: 'User created',
        data: userCreated
      })
    }
  )
  router.put(
    '/:id',
    validationHandler(userIdSchema, 'params', 'id'),
    validationHandler(updateUserSchema),
    existUser('params'),
    roleValidation,
    async (req, res) => {
      const { id } = req.params
      const { body: user } = req

      const updatedUser = await usersService.update({ id, user })

      res.json({
        message: 'User updated',
        data: updatedUser
      })
    }
  )
  router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validateRoles('ADMIN_ROLE'),
    validationHandler(userIdSchema, 'params', 'id'),
    existUser('params'),
    handleValidate,
    async (req, res) => {
      const { id } = req.params

      const userDeleted = await usersService.delete({ id })

      res.json({
        message: 'User deleted',
        data: userDeleted
      })
    }
  )
}

module.exports = userApi
