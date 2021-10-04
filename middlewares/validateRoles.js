function validateRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        error: 'Se quere verificar el role sin validar token primero'
      })
    }

    const { rol } = req.user

    if (!roles.includes(rol)) {
      return res.status(401).json({
        error: `Se requiere uno de estos roles ${roles}`
      })
    }
    next()
  }
}

module.exports = validateRoles
