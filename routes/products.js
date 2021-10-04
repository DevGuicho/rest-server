const express = require('express')
const { body, param } = require('express-validator')
const {
  existProduct,
  existCategoryById,
  existProductById
} = require('../helpers/db-validators')
const { jwtValidation, validateRoles } = require('../middlewares')
const handleValidate = require('../middlewares/handleValidation')
const ServicesProducts = require('../services/product')

function productApi(app) {
  const router = express.Router()
  const serviceProduct = new ServicesProducts()

  app.use('/api/products', router)

  router.get('/', async (req, res) => {
    const { limit, offset } = req.query
    const { products, total } = await serviceProduct.getAll({ limit, offset })
    res.json({
      message: 'Products listed',
      data: {
        products,
        total
      }
    })
  })

  router.get(
    '/:id',
    param('id').isMongoId().withMessage('El id es invalido'),
    param('id').custom(existProductById),
    handleValidate,
    async (req, res) => {
      const { id } = req.params
      const product = await serviceProduct.get({ id })
      res.json({
        message: 'Product retrieved',
        data: product
      })
    }
  )

  router.post(
    '/',
    jwtValidation,
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('name').custom(existProduct),
    body('category').notEmpty().withMessage('La categoria es obligatoria'),
    body('category').isMongoId().withMessage('El id no es valido'),
    body('category').custom(existCategoryById),
    handleValidate,
    async (req, res) => {
      const product = req.body
      product.user = req.user._id
      const productCreated = await serviceProduct.create({ product })
      res.status(201).json({
        message: 'Product created',
        data: productCreated
      })
    }
  )

  router.put(
    '/:id',
    jwtValidation,
    param('id').isMongoId().withMessage('El id no es valido'),
    param('id').custom(existProductById),
    handleValidate,
    async (req, res) => {
      const product = req.body
      const { id } = req.params

      const productUpdated = await serviceProduct.update({ id, product })

      res.json({
        message: 'Product updated',
        data: productUpdated
      })
    }
  )

  router.delete(
    '/:id',
    jwtValidation,
    validateRoles('ADMIN_ROLE'),
    param('id').isMongoId().withMessage('El id no es valido'),
    param('id').custom(existProductById),
    handleValidate,
    async (req, res) => {
      const { id } = req.params
      const userDeleted = await serviceProduct.delete({ id })
      res.json({
        message: 'Product deleted',
        data: userDeleted
      })
    }
  )
}

module.exports = productApi
