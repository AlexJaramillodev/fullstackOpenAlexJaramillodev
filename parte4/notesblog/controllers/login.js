const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Usuario = require('../models/usuario')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const usuario = await Usuario.findOne({ username })
  const passwordCorrect = usuario === null
    ? false
    : await bcrypt.compare(password, usuario.passwordHash)

  if (!(usuario && passwordCorrect )){
    return response.status(401).json( { error: 'Invalid username o password' })
  }

  const userForToken = {
    username: usuario.username,
    id: usuario._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  response
    .status(200)
    .send({ token, username: usuario.username, name: usuario.name })
})

module.exports = loginRouter
