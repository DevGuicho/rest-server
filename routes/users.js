const express = require('express')
const { body, param } = require('express-validator')

const UsersServices = require('../services/users')
const {
  handleValidate,
  jwtValidation,
  validateRoles
} = require('../middlewares')
const {
  isRoleValid,
  existEmail,
  existUser
} = require('../helpers/db-validators')

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
    param('id').isMongoId().withMessage('No es un id valido'),
    param('id').custom(existUser),
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
    body('email').isEmail().withMessage('No tiene un formato valido'),
    body('email').custom(existEmail),
    body('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password es obligatorio')
      .isLength({ min: 6 })
      .withMessage('El password debe tener mas de 6 caracteres'),
    body('rol').custom(isRoleValid),
    handleValidate,
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
    param('id').isMongoId().withMessage('No es un id valido'),
    param('id').custom(existUser),
    body('rol').custom(isRoleValid),
    handleValidate,
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
    jwtValidation,
    validateRoles('ADMIN_ROLE'),
    param('id').isMongoId().withMessage('No es un id valido'),
    param('id').custom(existUser),
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
