import apiClient from '@/services/system'

interface RegisterData {
  username: string
  phone: string
  name: string
  lastname: string
  password: string
}

interface LoginData {
  phone: string
  password: string
}

export interface ProfileData {
  username: string
  phone: string
  name: string
  lastname: string
  icons: string
}
const loginApi = async (data: LoginData) => {
  const response = await apiClient.post('/login', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response
}

const registerApi = async (data: RegisterData) => {
  const response = await apiClient.post('/register', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response
}

const profileApi = async (accessToken: string) => {
  const response = await apiClient.get('/profile', {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

const updateProfileNameApi = async (
  accessToken: string,
  data: RegisterData
) => {
  const response = await apiClient.patch('/profile/update/name', data, {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

const updateProfilePhoneApi = async (
  accessToken: string,
  data: RegisterData
) => {
  const response = await apiClient.patch('/profile/update/phone', data, {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

const updateProfileIconsApi = async (
  accessToken: string,
  data: RegisterData
) => {
  const response = await apiClient.patch('/profile/update/icons', data, {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

const updateProfileUsernameApi = async (
  accessToken: string,
  data: RegisterData
) => {
  try {
    const response = await apiClient.patch('/profile/update/username', data, {
      headers: {
        Authorization: accessToken, // Добавляем "Bearer"
        'Content-Type': 'application/json'
      }
    })

    return response.data
  } catch (error) {
    return Promise.reject(error.message || 'Неизвестная ошибка')
  }
}

const updateProfilePasswordApi = async (
  accessToken: string,
  data: RegisterData
) => {
  const response = await apiClient.patch('/profile/update/password', data, {
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })

  return response.data
}

const logoutApi = async () => {
  const response = await apiClient.post('/logout')

  return response.data
}

const refreshApi = async () => {
  try {
    // Отправляем POST-запрос на сервер для обновления токена
    const response = await fetch('http://localhost:8080/refresh', {
      method: 'POST',
      credentials: 'include' // Позволяет отправлять куки
    })

    // Проверяем, успешен ли ответ
    if (!response.ok) {
      throw new Error('Ошибка при обновлении токена')
    }

    // Предполагаем, что сервер возвращает объект с новым access_token
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error)
    throw new Error('Не удалось обновить токен')
  }
}

const searchUsersApi = async (accessToken: string, search?: string) => {
  const response = await apiClient.get('/search', {
    params: { username: search },
    headers: {
      Authorization: accessToken,
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

export {
  registerApi,
  loginApi,
  profileApi,
  logoutApi,
  refreshApi,
  updateProfileNameApi,
  updateProfilePhoneApi,
  updateProfileUsernameApi,
  updateProfileIconsApi,
  searchUsersApi,
  updateProfilePasswordApi
}
