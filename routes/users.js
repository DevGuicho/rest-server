const express = require('express')
const { body } = require('express-validator')
const handleValidate = require('../middlewares/handleValidation')
const UsersServices = require('../services/users')
const isRoleValid = require('../helpers/db-validators')

function userApi(app) {
  const usersService = new UsersServices()
  const router = express.Router()

  app.use('/api/users', router)

  router.post(
    '/',
    body('email').isEmail().withMessage('No tiene un formato valido'),
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
}

module.exports = userApi
