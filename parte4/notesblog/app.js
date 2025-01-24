const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usuariosRouter = require('./controllers/usuarios')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('conecting to', config.mongoUrl)

mongoose
  .connect(config.mongoUrl)
  .then((result) => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message)
  })
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/usuarios', usuariosRouter)
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandler)


module.exports = app
