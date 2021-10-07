const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')
const boom = require('@hapi/boom')
const { apiKey } = require('../../config')
const User = require('../../models/User')

passport.use(
  new Strategy(
    {
      secretOrKey: apiKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function (tokenPayload, cb) {
      const { id } = tokenPayload

      try {
        const user = await User.findById(id)
        if (!user) {
          return cb(boom.unauthorized(), false)
        }
        delete user.password

        cb(null, user)
      } catch (error) {
        return cb(error)
      }
    }
  )
)
