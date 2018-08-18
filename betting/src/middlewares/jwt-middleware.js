import expressJwt from 'express-jwt'
import config from './../config/config'

export default expressJwt({ secret: config.jwtSecret })
