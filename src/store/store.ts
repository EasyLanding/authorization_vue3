import { createStore } from 'vuex'
import { refreshApi } from '@/api/api'

const store = createStore({
  state: {
    accessToken: null
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token
    },
    clearAccessToken(state) {
      state.accessToken = null
    }
  },
  actions: {
    async refreshToken({ commit }) {
      try {
        const newToken = await refreshApi()
        commit('setAccessToken', newToken)
      } catch (error) {
        console.error('Ошибка обновления токена:', error)
        commit('clearAccessToken')
      }
    }
  },
  getters: {
    accessToken(state) {
      return state.accessToken
    }
  }
})

export default store
