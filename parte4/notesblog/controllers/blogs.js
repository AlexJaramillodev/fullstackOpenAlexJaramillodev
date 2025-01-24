const blogsRouter = require('express').Router()
const { request, response } = require('express')
const Blog = require('../models/blog')
const Usuario = require('../models/usuario')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('usuario', { username: 1, name: 1 })
  response.json(blogs)
})


//blogsRouter.get('/', (request, response) => {
//Blog
//.find({})
//.then(blogs => {
//response.json(blogs)
//})
//})

//const getTokenFrom = request => {
//const authorization = request.get('authorization')
//if (authorization && authorization.startsWith('Bearer ')){
//return authorization.replace('Bearer ', '')
//}
//return null
//}

blogsRouter.post('/',async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json( { error: 'token invalid' })
  }

  const usuario = request.user


  if (!usuario) {
    return response.status(400).json({ error: 'User not found' })
  }

  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    usuario: usuario.id,
  })

  const savedBlog = await blog.save()
  usuario.blogs = usuario.blogs.concat(savedBlog._id)
  await usuario.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id){
    return response.status(401).json( { error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  const usuario = request.user

  if (!usuario) {
    return response.status(400).json({ error: 'User not found' })
  }

  if (blog.usuario.toString() !== usuario._id.toString()) {
    return response.status(401).json({ error: 'only the creator can delete the blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id){
    return response.status(401).json( { error: 'token invalid' })
  }

  //const usuario = await Usuario.findById(decodedToken.id)
  const usuario = request.user
  const blog = await Blog.findById(request.params.id)

  if (!usuario) {
    return response.status(400).json({ error: 'User not found' })
  }

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blog.usuario.toString() !== usuario.id.toString()) {
    return response.status(401).json({ error: 'only the creator can update the blog' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes, usuario: usuario.id }, { new: true, runValidators: true, context: 'query' })

  response.json(updatedBlog)
})

blogsRouter.patch('/:id', async (request, response) => {
  const { likes } = request.body

  // Validar que el campo "likes" exista en la solicitud
  if (likes === undefined) {
    return response.status(400).json({ error: 'Likes field is required' })
  }

  // Actualizar únicamente el campo "likes"
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: 'query' }
  )

  // Si no se encuentra la publicación, responder con un 404
  if (!updatedBlog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  // Responder con el blog actualizado
  response.json(updatedBlog)
})




module.exports = blogsRouter