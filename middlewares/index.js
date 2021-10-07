const jwtValidation = require('./jwtValidation')
const validateRoles = require('./validateRoles')
const handleValidate = require('./handleValidation')
const dbValidator = require('./dbValidator')

const validationHandler = require('./validationHandler')

module.exports = {
  ...jwtValidation,
  validateRoles,
  handleValidate,
  validationHandler,
  ...dbValidator
}
