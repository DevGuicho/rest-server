const path = require('path')
const express = require('express')
const cloudinary = require('cloudinary').v2
const { cloudinaryUrl } = require('../config')

const uploadValidator = require('../helpers/upload-validator')
const Product = require('../models/Product')
const User = require('../models/User')
const {
  existCollection,
  fileValidation,
  validationHandler
} = require('../middlewares/index')
const mongoIdSchema = require('../utils/schemas/mongoIdSchema')

cloudinary.config(cloudinaryUrl)

function uploadsApi(app) {
  const router = express.Router()
  app.use('/api/uploads', router)

  router.post('/', fileValidation, async (req, res) => {
    try {
      const pathFile = await uploadValidator({ files: req.files })
      res.json({
        message: 'File uploaded successfully',
        data: pathFile
      })
    } catch (error) {
      res.json({
        error: error.message
      })
    }
  })

  router.put(
    '/:collection/:id',
    existCollection,
    validationHandler(mongoIdSchema, 'params', 'id'),
    fileValidation,
    async (req, res) => {
      const { collection, id } = req.params

      let model
      switch (collection) {
        case 'users':
          model = await User.findById(id)
          if (!model) {
            return res.status(400).json({
              msg: `No existe un usuario con el id ${id}`
            })
          }
          break
        case 'products':
          model = await Product.findById(id)
          if (!model) {
            return res.status(400).json({
              msg: `No existe un producto con el id ${id}`
            })
          }
          break
        default:
          return res.status(500).json({
            msg: 'Not implmented'
          })
      }

      // Limpiar imagenes previas

      if (model.img) {
        const nameArr = model.img.split('/')
        const name = nameArr[nameArr.length - 1]
        const [publicId] = name.split('.')
        await cloudinary.uploader.destroy(publicId)
      }

      const resp = await cloudinary.uploader.upload(req.files.file.tempFilePath)

      model.img = resp.secure_url
      await model.save()
      res.json({
        message: 'Img updated successfully',
        data: model
      })
    }
  )
  router.get(
    '/:collection/:id',
    existCollection,
    validationHandler(mongoIdSchema, 'params', 'id'),
    async (req, res) => {
      const { collection, id } = req.params

      let model

      switch (collection) {
        case 'users':
          model = await User.findById(id)
          if (!model) {
            return res.status(400).json({
              msg: `No existe un usuario con el id ${id}`
            })
          }
          break
        case 'products':
          model = await Product.findById(id)
          if (!model) {
            return res.status(400).json({
              msg: `No existe un producto con el id ${id}`
            })
          }
          break
        default:
          return res.status(500).json({
            msg: 'Not implmented'
          })
      }

      if (model.img) {
        return res.redirect(model.img)
      }
      res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))
    }
  )
}

module.exports = uploadsApi
