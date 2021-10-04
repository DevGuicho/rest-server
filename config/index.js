if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

module.exports = {
  port: process.env.PORT,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  apiKey: process.env.API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  cloudinaryUrl: process.env.CLOUDINARY_URL
}
