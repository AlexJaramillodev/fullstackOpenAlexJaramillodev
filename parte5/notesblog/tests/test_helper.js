const Blog = require('../models/blog')
const Usuario = require('../models/usuario')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

//se usa para crear un id falso de objeto de base de datos que no pertenezca a ningun objeto de nota en la bd
const nonExistingId = async () => {
  const note = new Note ({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

//funcion para verificar los bogs almacenados en la bd
const blogsInDb = async () => {
  const blogs = await Blog.find({})

  return blogs.map(blog => blog.toJSON())
}

//funcion verificar los usuarios almacenados en la bd
const usuariosInDb = async () => {
  const usuarios = await Usuario.find({})
  return usuarios.map(u => u.toJSON())
}

//funcion para crear un testUser con password encriptado
const createTestUser = async () => {
  const passwordHash = await bcrypt.hash('testpassword', 10)
  const usuario = new usuario({
    username: 'testuser',
    name: 'testuser',
    passwordHash,
  })
  return usuario.save()
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usuariosInDb, createTestUser
}