const debug = require('debug')('app:server')
const express = require('express')
const passport = require('passport')
const cors = require('cors')
const helmet = require('helmet')

const { port } = require('./config')
const { dbConnection } = require('./database/config')
const userApi = require('./routes/users')
const authApi = require('./routes/auth')
const categoriesApi = require('./routes/categories')
const productApi = require('./routes/products')
const searchApi = require('./routes/search')
const uploadsApi = require('./routes/uploads')
const fileUpload = require('express-fileupload')
const {
  wrapError,
  logError,
  errorHandler,
  notFoundHandler
} = require('./middlewares')

const app = express()

// MIDDLEWARES
app.use(cors())
app.use(helmet())
app.use(express.static('public'))
app.use(express.json())
app.use(passport.initialize())

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

// ROUTES
authApi(app)
categoriesApi(app)
productApi(app)
searchApi(app)
uploadsApi(app)
userApi(app)

// ERROR HANDLERS
app.use(notFoundHandler)

app.use(wrapError)
app.use(logError)
app.use(errorHandler)

dbConnection()
app.listen(port, () => debug(`Server running on port ${port}`))
