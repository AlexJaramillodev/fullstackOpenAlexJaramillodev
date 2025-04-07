import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let setNotification = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const setNotificationHandler = callback => {
  setNotification = callback
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

const patch = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.patch(`${baseUrl}/${id}`, updatedObject, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

axios.interceptors.response.use(
  response => response, // Si la respuesta es correcta, la devolvemos tal cual
  error => {
    if (!error.response) {
      return Promise.reject(error) // 🔥 Si no hay respuesta del servidor, rechazar error
    }

    const { status, data } = error.response

    // 🔥 Caso 1: Token expirado (Cerrar sesión y redirigir)
    if (status === 401 && data.error === 'token expired') {
      console.error('⚠️ Token expirado. Redirigiendo al login...')

      if (setNotification) {
        setNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'error')
      }

      window.sessionStorage.removeItem('loggedBlogappUser') // 🔥 Cerrar sesión
      window.location.href = '/login' // 🔥 Redirigir al login
    }

    // 🔥 Caso 2: Token inválido (Mostrar error pero NO cerrar sesión)
    else if (status === 401 && data.error === 'invalid token') {
      console.error('⚠️ Token inválido.')

      if (setNotification) {
        setNotification('Token inválido. Intenta iniciar sesión nuevamente.', 'error')
      }
    }

    // 🔥 Caso 3: Usuario no autorizado (403) (Mostrar error pero NO cerrar sesión)
    else if (status === 403 && data.error === 'User not authorized') {
      console.error('🚫 No tienes permiso para editar esta nota.')

      if (setNotification) {
        setNotification('No tienes permiso para editar esta nota.', 'error')
      }
    }

    return Promise.reject(error) // 🔥 SIEMPRE rechazamos el error para que Axios lo maneje correctamente
  }
)



export default { getAll, create, setToken, update, setNotificationHandler, patch, remove }