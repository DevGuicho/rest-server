const debug = require('debug')('app:database')
const mongoose = require('mongoose')
const { dbUser, dbPassword, dbHost, dbName } = require('../config')

const dbUri = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}`

const dbConnection = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    debug('Database connected')
  } catch (error) {
    console.log(error)
    throw new Error('Error inicilizando la base de datos')
  }
}

module.exports = {
  dbConnection
}
