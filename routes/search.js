/* eslint-disable no-case-declarations */
const express = require('express')
const { param } = require('express-validator')

const { existCollection } = require('../helpers/db-validators')
const handleValidate = require('../middlewares/handleValidation')
const ServicesSearch = require('../services/search')

function searchApi(app) {
  const router = express.Router()
  const servicesSearch = new ServicesSearch()
  app.use('/api/search', router)

  router.get(
    '/:collection/:term',
    param('collection').custom(existCollection),
    handleValidate,
    async (req, res) => {
      const { collection, term } = req.params

      switch (collection) {
        case 'users':
          const user = await servicesSearch.searchUser({ term })
          res.json({
            message: 'User found',
            data: user
          })
          break
        case 'categories':
          const categories = await servicesSearch.searchCategory({ term })
          res.json({
            message: 'Categories found',
            data: categories
          })
          break
        case 'products':
          const products = await servicesSearch.searchProduct({ term })
          res.json({
            message: 'Products found',
            data: products
          })
          break
        case 'roles':
          break
        default:
          res.json({
            message: 'Busqueda no implementada'
          })
          break
      }
    }
  )
}

module.exports = searchApi
