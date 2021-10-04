const jwtValidation = require('./jwtValidation')
const validateRoles = require('./validateRoles')
const handleValidate = require('./handleValidation')

module.exports = {
  ...jwtValidation,
  validateRoles,
  handleValidate
}
