function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: 'Page Not Found'
  })
  next()
}

module.exports = notFoundHandler
