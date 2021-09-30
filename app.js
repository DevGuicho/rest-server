const debug = require('debug')('app:server')
const express = require('express')
const cors = require('cors')
const { port } = require('./config')
const { dbConnection } = require('./database/config')
const userApi = require('./routes/users')
const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

userApi(app)

dbConnection()
app.listen(port, () => debug('Server running on port 3000'))
