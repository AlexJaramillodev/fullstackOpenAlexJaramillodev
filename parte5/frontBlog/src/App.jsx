import { useState, useEffect, useRef } from 'react'
import '../src/index.css'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then((initialBlogs) => {
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.sessionStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.setNotificationHandler((message, type) => {
      setErrorMessage(message)
      setMessageType(type)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.sessionStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch (exception) {
      console.error('Login failed', exception)
      setErrorMessage('Wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setUsername('')
    setPassword('')
    setErrorMessage('Logged out')
    setMessageType('success')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {

    try {
      const returnedBlog = await blogService.create(blogObject)
      const updatedBlog = { ...returnedBlog, usuario: user }

      setBlogs(blogs.concat(updatedBlog).sort((a, b) => b.likes - a.likes))
      setErrorMessage('Blog agregado exitosamente')
      setMessageType('success')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    }catch (error) {
      console.error('Error al agregar el blog:', error)
      setErrorMessage('No se pudo agregar el blog')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const updateBlog = (updateBlog, id) => {
    if (updateBlog){
      setBlogs(blogs.map(blog => blog.id !== updateBlog.id ? blog : updateBlog).sort((a, b) => b.likes - a.likes))
    } else {
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  return (
    <div className='container'>

      <h1>APPBlogs</h1>
      <Notification message = {errorMessage} type={messageType}/>

      {user === null ? (
        <div>
          <h2>Login</h2>
          <LoginForm
            handleLogin = {handleLogin}
            username = {username}
            setUsername = {setUsername}
            password = {password}
            setPassword = {setPassword}
          />
        </div>
      ) : (

        <div>
          <h2>Lista de Blogs</h2>
          <div className='user-info'>
            <p>{user.name} logged-in</p>
            <button className='logout-button' onClick={handleLogout}>logout</button>
          </div>
          <Togglable buttonLabel='new blog' ref={blogFormRef} buttonClass="new-blog-button">
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user}/>
          ))}
        </div>
      )
      }
    </div>

  )
}


export default App
