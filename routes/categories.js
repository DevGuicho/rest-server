const express = require('express')
const passport = require('passport')

const {
  validateRoles,
  existCategoryById,
  validationHandler,
  existCategory
} = require('../middlewares')

const ServicesCategories = require('../services/categories')
const {
  createCategorySchema,
  updateCategorySchema
} = require('../utils/schemas/categorySchema')
const mongoIdSchema = require('../utils/schemas/mongoIdSchema')

require('../utils/strategies/jwt')

function categoriesApi(app) {
  const router = express.Router()
  const servicesCategory = new ServicesCategories()

  app.use('/api/categories', router)

  // Obtener todas las categorias - público
  router.get('/', async (req, res) => {
    const { limit, offset } = req.query
    const { total, categories } = await servicesCategory.getCategories({
      limit,
      offset
    })
    res.json({
      message: 'Categories listed',
      data: { categories, total }
    })
  })

  // Obtener una categoria por id - publico
  router.get(
    '/:id',
    validationHandler(mongoIdSchema, 'params', 'id'),
    existCategoryById('params', 'id'),
    async (req, res) => {
      const { id } = req.params
      const category = await servicesCategory.get({ id })
      res.json({
        message: 'Category retrieved',
        data: category
      })
    }
  )

  // Crear categoria - privado - cualquier rol
  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validationHandler(createCategorySchema),
    existCategory,
    async (req, res) => {
      const { name } = req.body
      const newCategory = await servicesCategory.create({
        name,
        user: req.user._id
      })
      res.status(201).json({
        message: 'Category created',
        data: newCategory
      })
    }
  )

  // Actualizar categoria - privado - cualquier rol con token valiodo
  router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validationHandler(mongoIdSchema, 'params', 'id'),
    validationHandler(updateCategorySchema),
    existCategoryById,
    async (req, res) => {
      const { id } = req.params
      const category = req.body
      const categoryUpdated = await servicesCategory.update({ id, category })
      res.json({
        message: 'Category updated',
        data: categoryUpdated
      })
    }
  )

  // Borrrar una categoria - Admin
  router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validateRoles('ADMIN_ROLE'),
    validationHandler(mongoIdSchema, 'params', 'id'),
    existCategoryById('params', 'id'),
    async (req, res) => {
      const { id } = req.params
      const categoryDeleted = await servicesCategory.delete({ id })
      res.json({
        message: 'Category deleted',
        data: categoryDeleted
      })
    }
  )
}

module.exports = categoriesApi
