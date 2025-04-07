import { screen, render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'



describe('test BlogForm', () => {
  test('llama a addBlog con los detalles correctos, incluyendo usuario, cuando se envía el formulario', async () => {
    const mockAddBlog = vi.fn()


    render(<BlogForm addBlog={mockAddBlog} />)

    await userEvent.type(screen.getByLabelText(/Title:/i), 'Nuevo Blog')
    await userEvent.type(screen.getByLabelText(/Author:/i), 'Autor Prueba')
    await userEvent.type(screen.getByLabelText(/URL:/i), 'http://ejemplo.com')
    await userEvent.type(screen.getByLabelText(/Likes:/i), '10')

    await userEvent.click(screen.getByRole('button', { name: /Save/i }))

    expect(mockAddBlog).toHaveBeenCalledTimes(1)
    expect(mockAddBlog).toHaveBeenCalledWith({
      title: 'Nuevo Blog',
      author: 'Autor Prueba',
      url: 'http://ejemplo.com',
      likes: 10
    })
  })
})