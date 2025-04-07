const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const Usuario = require('../models/usuario')

testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await Usuario.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter