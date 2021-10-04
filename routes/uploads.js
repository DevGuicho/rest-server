const path = require('path')
const fs = require('fs')
const express = require('express')
const cloudinary = require('cloudinary').v2
const { cloudinaryUrl } = require('../config')
const { param } = require('express-validator')
const { existCollection } = require('../helpers/db-validators')
const uploadValidator = require('../helpers/upload-validator')
const { handleValidate } = require('../middlewares')
const fileValidation = require('../middlewares/fileValidation')
const Product = require('../models/Product')
const User = require('../models/User')

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

  /*  router.put(
    '/:collection/:id',
    param('collection').custom(existCollection),
    param('id').isMongoId().withMessage('Id no valido'),
    handleValidate,
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
        const pathImg = path.join(
          __dirname,
          '../uploads',
          collection,
          model.img
        )
        if (fs.existsSync(pathImg)) {
          fs.unlinkSync(pathImg)
        }
      }

      const nameFile = await uploadValidator({
        files: req.files,
        dir: collection
      })
      model.img = nameFile
      await model.save()
      res.json({
        message: 'Img updated successfully',
        data: model
      })
    }
  ) */
  router.put(
    '/:collection/:id',
    param('collection').custom(existCollection),
    param('id').isMongoId().withMessage('Id no valido'),
    handleValidate,
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
    param('collection').custom(existCollection),
    param('id').isMongoId(),
    handleValidate,
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
