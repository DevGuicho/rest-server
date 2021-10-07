const jwtValidation = require('./jwtValidation')
const validateRoles = require('./validateRoles')
const handleValidate = require('./handleValidation')
const dbValidator = require('./dbValidator')

const validationHandler = require('./validationHandler')
const fileValidation = require('./fileValidation')

module.exports = {
  fileValidation,
  ...jwtValidation,
  validateRoles,
  handleValidate,
  validationHandler,
  ...dbValidator
}
