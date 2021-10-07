const jwtValidation = require('./jwtValidation')
const validateRoles = require('./validateRoles')
const handleValidate = require('./handleValidation')
const dbValidator = require('./dbValidator')

const validationHandler = require('./validationHandler')
const fileValidation = require('./fileValidation')
const errorHandler = require('./errorHandler')
const notFoundHandler = require('./notFoundHandler')

module.exports = {
  fileValidation,
  validateRoles,
  handleValidate,
  validationHandler,
  notFoundHandler,
  ...jwtValidation,
  ...dbValidator,
  ...errorHandler
}
