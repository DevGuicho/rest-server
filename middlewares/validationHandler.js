const boom = require('@hapi/boom')

function validate(schema, data, param) {
  const { error } = schema.validate(data)
  return error
}

function validationHandler(schema, check = 'body', param) {
  return (req, res, next) => {
    let data
    data = req[check]
    if (param) {
      data = req[check][param]
    }
    const error = validate(schema, data)
    if (error) {
      return next(boom.badRequest(error))
    }
    next()
  }
}

module.exports = validationHandler
