import store from '@/store/store'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Укажите базовый URL вашего API
  timeout: 10000, // Таймаут для запросов
  withCredentials: true
})

// Перехватчик для обработки ответов
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Проверка на ошибку "Invalid token"
    if (
      error.status === 401 &&
      error.response.data.result === 'Invalid token'
    ) {
      try {
        await store.dispatch('refreshToken') // Попробуем обновить токен
        const newAccessToken = store.getters.accessToken // Получаем новый токен

        // Повторяем исходный запрос с новым токеном
        if (error.config) {
          error.config.headers['Authorization'] = newAccessToken // Устанавливаем новый токен
          return apiClient.request(error.config) // Повторяем запрос
        }
      } catch (refreshError) {
        console.log('Ошибка при обновлении токена:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    // Обработка других ошибок
    if (error.response && error.response.data && error.response.data.result) {
      return Promise.reject({ message: error.response.data.result })
    }

    return Promise.reject(error.message || 'Неизвестная ошибка')
  }
)

export default apiClient
