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
const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// ROUTES
authApi(app)
categoriesApi(app)
userApi(app)
productApi(app)
searchApi(app)

app.get('/', (req, res) => {
  res.render('pages/index')
})
app.use(notFoundHandler)

dbConnection()
app.listen(port, () => debug('Server running on port 3000'))
