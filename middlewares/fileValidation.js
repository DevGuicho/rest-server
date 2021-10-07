const boom = require('@hapi/boom')

const fileValidation = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(boom.badRequest('No files were uploaded.'))
  }
  next()
}

module.exports = fileValidation
