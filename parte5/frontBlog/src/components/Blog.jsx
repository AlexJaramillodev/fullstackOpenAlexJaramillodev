import '../index.css'
import { useState } from 'react'
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    console.log('Botón like fue presionado')// 🔍 Depuración
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,

    }

    try {
      const returnedBlog = await blogService.patch(blog.id, updatedBlog)
      console.log('Se llamó a updateBlog con:', returnedBlog)// 🔍 Depuración
      updateBlog(returnedBlog)
    } catch (exception) {
      console.error('Failed to update blog', exception)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.remove(blog.id)
        updateBlog(null, blog.id)
      } catch (exception) {
        console.error('Failed to delete blog', exception)
      }
    }
  }

  //console.log('User:', user)
  //console.log('Blog:', blog)

  return (
    <div className='blog' data-testid='blog-item'>
      <div className='blog-header'>
        <h3 className='blog-title' data-testid='blog-title' >{blog.title}</h3>
        <p className="blog-author">{`Autor: ${blog.author}`}</p>
        {visible ? (
          <button data-testid='toggle-details' onClick={toggleVisibility}>ver menos</button>
        ) : (
          <button data-testid='toggle-details' onClick={toggleVisibility}>ver más</button>
        )}
      </div>
      {visible && (
        <div className='blog-details'>
          <p className="blog-url">{`URL: ${blog.url}`}</p>
          <p className='blog-likes' data-testid='blog-likes' >{`Likes: ${blog.likes}`}<button onClick={handleLike}>like</button></p>
          <p>Creado por: {blog.usuario.name}</p>
          {blog.usuario.id === user.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog