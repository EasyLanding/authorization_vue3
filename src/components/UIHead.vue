<template>
  <div class="header-container">
    <div class="header-info">
      <img :src="profileIcons" alt="Chat Icon" class="chat-avatar" />
      <p>{{ profileName }}</p>
    </div>
    <img
      src="../assets/logout-icon.svg"
      alt="myfamilly"
      class="logout-icon"
      @click="logoutHandler"
    />
  </div>
</template>

<script>
import PersonCart from '@/ui/PersonCart.vue'
import { profileApi, logoutApi } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  name: 'UIHead',
  data() {
    return {
      profileName: '',
      profileIcons: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken'])
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async logoutHandler() {
      try {
        const logoutResponse = await logoutApi() // Получаем ответ от API
        console.log(logoutResponse.message) // Выводим сообщение о разлогине в консоль

        // Очищаем accessToken в Vuex store
        this.$store.commit('clearAccessToken')
        localStorage.setItem('isAuthenticated', null)
        this.$router.push({ name: 'Login' }) // Перенаправляем на страницу логина
      } catch (error) {
        console.error('Ошибка при получении логаута:', error)
      }
    },
    async fetchProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }

        const response = await profileApi(this.accessToken) // Используем токен из состояния
        // Предполагаем, что API возвращает объект с полями name и icon
        this.profileName = `${response.name} ${response.lastname}`
        this.profileIcons = response.icons // Убедитесь, что это правильное поле из вашего API
      } catch (error) {
        console.error('Ошибка при получении профиля:', error)
      }
    }
  },
  components: {
    PersonCart
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #21003e;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.header-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 1000px;
  margin-right: 10px;
}
.logout-icon {
  cursor: pointer;
}
</style>
