const express = require('express')
const passport = require('passport')

const {
  validateRoles,
  validationHandler,
  existProductById,
  existProduct,
  existCategoryById
} = require('../middlewares')
const ServicesProducts = require('../services/product')

const mongoIdSchema = require('../utils/schemas/mongoIdSchema')
const {
  createProductSchema,
  updateProductSchema
} = require('../utils/schemas/productSchema')

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
    validationHandler(mongoIdSchema, 'params', 'id'),
    existProductById,
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
    passport.authenticate('jwt', { session: false }),
    validationHandler(createProductSchema),
    existProduct,
    existCategoryById('body', 'category'),
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
    passport.authenticate('jwt', { session: false }),
    validationHandler(mongoIdSchema, 'params', 'id'),
    validationHandler(updateProductSchema),
    existProductById,
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
    passport.authenticate('jwt', { session: false }),
    validateRoles('ADMIN_ROLE'),
    validationHandler(mongoIdSchema, 'params', 'id'),
    existProductById,
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
