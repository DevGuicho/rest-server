const debug = require('debug')('app:server')
const path = require('path')
const express = require('express')
const cors = require('cors')
const { port } = require('./config')
const { dbConnection } = require('./database/config')
const userApi = require('./routes/users')
const notFoundHandler = require('./middlewares/notFoundHandler')
const authApi = require('./routes/auth')
const categoriesApi = require('./routes/categories')
const productApi = require('./routes/products')
const searchApi = require('./routes/search')
const uploadsApi = require('./routes/uploads')
const fileUpload = require('express-fileupload')
const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
  })
)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// ROUTES
authApi(app)
categoriesApi(app)
productApi(app)
searchApi(app)
uploadsApi(app)
userApi(app)

app.get('/', (req, res) => {
  res.render('pages/index')
})
app.use(notFoundHandler)

dbConnection()
app.listen(port, () => debug('Server running on port 3000'))
