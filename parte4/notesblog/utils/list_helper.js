const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return null

  const favorite = blogs.reduce( (max, blog) => (
    blog.likes > max.likes ? blog : max
  ), blogs[0])

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null

  //agrupar los blogs por autor
  const grouped = _.groupBy(blogs, 'author')

  //crea una lista con el autor y la cantidad de blogs
  const authors = _.map(grouped, (posts, author) => ({
    author,
    blogs: posts.length
  }))
  //encuentra el autor con mas blogs
  return _.maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return null

  //agrupar los blogs por autor
  const grouped = _.groupBy(blogs, 'author')

  //calcular el total de likes para cada autor
  const authors = _.map(grouped, (posts, author) => ({
    author,
    likes: _.sumBy(posts, 'likes'),
  }))
  //encontrar el autor con el maximo numero de likes
  return _.maxBy(authors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
