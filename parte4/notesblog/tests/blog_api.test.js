const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const jwt = require('jsonwebtoken')
const helper = require('./test_helper')
const app = require('../app')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const Usuario = require('../models/usuario')



const api = supertest(app)

//reseteamos la bd y guardamos los blogs en la bd
beforeEach (async () => {
  await Blog.deleteMany({})
  await Usuario.deleteMany({})

  //crear un usuario y un token para las pruebas
  const passwordHash = await bcrypt.hash('sekret', 10)
  const usuario = new Usuario({ username: 'root', name: 'Root User', passwordHash })
  await usuario.save()

  //asociamos el id del usuario a los blogs iniciales
  const usuarioid = usuario._id
  const blogsWithUser = helper.initialBlogs.map(blog => ({ ...blog, usuario: usuarioid }))

  const blogsObjects = blogsWithUser.map(blog => new Blog(blog))
  const promiseArray = blogsObjects.map(blog => blog.save())
  await Promise.all(promiseArray)


  //crear el token para el usuario
  const userForToken = {
    username: usuario.username,
    id: usuario._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)
})

//verifica que los datos retornados sean en formato json y la canidad correcta
test('blogs son retornados como json y el numero correcto de blogs en bd', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

//verifica el valor de una propiedad del objeto sea la correcta
test('el identificador de el blog  se llame id y no _id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
    assert.strictEqual(blog._v, undefined)
  })
})

//verifica que se cree correctamente un blog y se guarde su contenido
test('se crea correctamente un blog, se incrementa el valor y contenido se guarda correctamente', async () => {
  const newBlog = {
    title: 'blog realizado por adrian',
    author: 'Adrian A. Jaramillo',
    url: 'http://www.u.arizona.edu/este_es_un_blog_de_prueba/Go_To_Considered_Harmful.html',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('blog realizado por adrian'))
})

//verificar que si falta una propiedad el valor por defecto sea 0
test('/verificar que si falta la propiedad likes, el valor por defecto sea 0', async () => {
  const newBlog = {
    title: 'blog sin likes',
    author: 'author sin likes',
    url: 'http://www.ejemplo_sin_likes.html',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const createdBlog = response.body
  assert.strictEqual(createdBlog.likes, 0)
})

//verifica que una prueba que le faltan propiedades no se guarde
test('verifica que una prueba que le faltan propiedades no se guarde', async () => {
  const newBlog = {
    author: 'author sin title y sin url',
    likes: 8,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

//verifica que un blog pueda ser eliminado
describe('borrado de blog', () => {

  test('eliminar blog y respnder con status 204 si el id es valido', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const blogtitle = blogsAtEnd.map(r => r.title)
    assert(!blogtitle.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })

})

describe('actulizacion de un blog', () => {

  test('se puede actualizar la informacion de un blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'blog actualizado',
      author: 'autor actualizado',
      url: 'http://wwww.ejemplo_actualizado.html',
      likes: 100
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedBlog.title)
    assert.strictEqual(response.body.author, updatedBlog.author)
    assert.strictEqual(response.body.url, updatedBlog.url)
    assert.strictEqual(response.body.likes, updatedBlog.likes)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  describe('no se puede actualizar un blog sin token y devuelve un error 401', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: 'blog actualizado',
      author: 'autor actualizado',
      url: 'http://wwww.ejemplo_actualizado.html',
      likes: 100
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token invalid')

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)

    assert(titles.includes(blogToUpdate.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

})

describe('when there is initially one user in db', () => {

  test('creation succeds with a fresh username', async () => {
    const usuarioAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'adrian',
      name: 'Adrian A. Jaramillo',
      password: 'password',
    }


    await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuarioAtStart.length + 1)

    const usernames = usuariosAtEnd.map(u => u.username)
    assert(usernames.includes(newUsuario.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'root',
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)

    assert.strictEqual(result.body.error, 'expected `username` to be unique')
  })
})

//pruebas de validacion de usuario
describe('validaciones de creación de usuario', () => {
  test('falla si falta el campo username', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      name: 'User sin username',
      password: 'password',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username is required and must be at least 3 characters')

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)
  })

  test('falla si falta el campo password', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'user_sin_password',
      name: 'User sin password',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'password is required and must be at least 3 characters')

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)
  })

  test('falla si el password tiene menos de 3 caracteres', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'short_password',
      name: 'User con password corto',
      password: 'pw',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'password is required and must be at least 3 characters')

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)
  })

  test('falla si el username tiene menos de 3 caracteres', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'us',
      name: 'User con username corto',
      password: 'valid_password',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username is required and must be at least 3 characters')

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)
  })

  test('falla si el password tiene solo espacios en blanco', async () => {
    const usuariosAtStart = await helper.usuariosInDb()

    const newUsuario = {
      username: 'user_blancos',
      name: 'User con password blanco',
      password: '   ',
    }

    const result = await api
      .post('/api/usuarios')
      .send(newUsuario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'password is required and must be at least 3 characters')

    const usuariosAtEnd = await helper.usuariosInDb()
    assert.strictEqual(usuariosAtEnd.length, usuariosAtStart.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})