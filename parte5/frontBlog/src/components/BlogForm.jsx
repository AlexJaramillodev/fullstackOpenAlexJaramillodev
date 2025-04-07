import { useState } from 'react'
import '../index.css'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState(0)


  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({ title, author, url, likes })
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes(0)
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit} className='blog-form'>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id='title'
            data-testid='title'
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id='author'
            data-testid='author'
            value={author}
            name="author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            type="text"
            id='url'
            data-testid='url'
            value={url}
            name="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="likes">Likes:</label>
          <input
            type="number"
            id='likes'
            data-testid='likes'
            value={likes}
            name="likes"
            onChange={(e) => setLikes(Number(e.target.value))}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
}

export default BlogForm