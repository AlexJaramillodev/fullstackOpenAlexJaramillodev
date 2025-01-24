const bcrypt = require('bcrypt')
const usuariosRouter = require('express').Router()
const Usuario = require('../models/usuario')

usuariosRouter.get('/', async (request, response) => {
  const usuarios = await Usuario.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(usuarios)
})

usuariosRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3 || password.trim() === '') {
    return response.status(400).json({
      error: 'password is required and must be at least 3 characters'
    })
  }

  if (!username || username.length < 3 || username.trim() === '') {
    return response.status(400).json({
      error: 'username is required and must be at least 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const usuario = new Usuario({
    username,
    name,
    passwordHash,
  })

  const savedUsuario = await usuario.save()

  response.status(201).json(savedUsuario)
})

module.exports = usuariosRouter