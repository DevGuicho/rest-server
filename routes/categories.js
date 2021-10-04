const express = require('express')
const { body, param } = require('express-validator')
const { existCategory, existCategoryById } = require('../helpers/db-validators')
const {
  jwtValidation,
  handleValidate,
  validateRoles
} = require('../middlewares')
const ServicesCategories = require('../services/categories')

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
    param('id').isMongoId().withMessage('No es un id valido'),
    param('id').custom(existCategoryById),
    handleValidate,
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
    jwtValidation,
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('name').custom(existCategory),
    handleValidate,
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
    jwtValidation,
    param('id').isMongoId('El id es invalido'),
    param('id').custom(existCategoryById),
    handleValidate,
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
    jwtValidation,
    validateRoles('ADMIN_ROLE'),
    param('id').isMongoId().withMessage('No es un id valido'),
    param('id').custom(existCategoryById),
    handleValidate,
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
