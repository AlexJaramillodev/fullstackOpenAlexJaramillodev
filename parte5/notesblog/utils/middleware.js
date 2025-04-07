const logger = require('./logger')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body:', request.body)
  logger.info('---')
  next()
}

const unknowEndpoint = (request, response) => {
  response.status(400).send({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }else if(error.name === 'JsonWebTokenError'){
    return response.status(401).json( { error: 'token invalid' })
  }else if(error.name === 'TokenExpiredError'){
    return response.status(401).json( { error: 'token expired' })
  }else if (error.message === 'User not authorized') {
    return response.status(403).json({ error: 'User not authorized' })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')){
    request.token = authorization.replace(/^bearer\s/i, '')
  }else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (decodedToken.id) {
      request.user = await Usuario.findById(decodedToken.id)
    }else {
      request.user = null
    }
  }
  next()
}

module.exports = {
  requestLogger,
  unknowEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}