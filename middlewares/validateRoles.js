const boom = require('@hapi/boom')
function validateRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        boom.unauthorized(
          'Se quere verificar el role sin validar token primero'
        )
      )
    }

    const { rol } = req.user

    if (!roles.includes(rol)) {
      return next(boom.unauthorized(`Se requiere uno de estos roles ${roles}`))
    }
    next()
  }
}

module.exports = validateRoles
