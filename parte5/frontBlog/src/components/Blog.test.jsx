import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'


vi.mock('../services/blogs', () => ({
  default: {
    patch: vi.fn((id, updatedBlog) => {
      console.log('📡 Se llamó a blogService.patch con:', id, updatedBlog)
      return Promise.resolve({ ...updatedBlog, id }) // ✅ Retorna un objeto válido con `id`
    })
  }
}))

import Blog from './Blog'

describe('blog componente', () => {
  const blog = {
    title: 'Blog de prueba',
    author: 'Autor de prueba',
    url: 'http://prueba.com',
    likes: 10,
    id: '12345',
    usuario: {
      name: 'Usuario de prueba',
      id: 'usuario123'
    }
  }

  const user = {
    name: 'Usuario de prueba',
    id: 'usuario123'
  }

  const mockUpdateBlog = vi.fn()

  //prueba que verifique que el componente que muestra un blog muestre el título y el autor del blog, pero no muestre su URL o el número de likes por defecto
  test('muestra el título y el autor del blog', () => {
    render(<Blog blog={blog} updateBlog={mockUpdateBlog} user={user} />)

    const title = screen.getByText('Blog de prueba')
    const author = screen.getByText('Autor: Autor de prueba')
    const url = screen.queryByText('URL: http://prueba.com')
    const likes = screen.queryByText('Likes: 10')


    expect(title).toBeInTheDocument()
    expect(author).toBeInTheDocument()

    expect(url).not.toBeInTheDocument()
    expect(likes).not.toBeInTheDocument()
  })

  //prueba que verifique que al hacer click en el botón de ver se muestre la URL y el número de likes del blog
  test('al hacer click en el botón de ver se muestra la URL y el número de likes', async () => {
    render(<Blog blog={blog} updateBlog={mockUpdateBlog} user={user} />)

    const button = screen.getByText('ver más')
    await userEvent.click(button)

    const url = screen.getByText('URL: http://prueba.com')
    const likes = screen.getByText('Likes: 10')

    expect(url).toBeInTheDocument()
    expect(likes).toBeInTheDocument()
  })

  //prueba que verifique que si se hace clic en el botón de "like" se llama a updateblog dos veces
  test('si se hace clic dos veces en "like" se llama a la función de actualización dos veces', async () => {

    render(<Blog blog={blog} updateBlog={mockUpdateBlog} user={user} />)

    const button = screen.getByText('ver más')
    await userEvent.click(button)

    const likeButton = screen.getByText('like')

    console.log('🟢 Haciendo primer clic en like') // 🔍 Depuración
    await userEvent.click(likeButton)

    console.log('🟢 Haciendo segundo clic en like') // 🔍 Depuración
    await userEvent.click(likeButton)


    await waitFor(() => {
      console.log('🟢 Verificando llamadas a updateBlog:', mockUpdateBlog.mock.calls.length)
      expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
    })

  })


})