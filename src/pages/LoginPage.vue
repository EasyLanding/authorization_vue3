<template>
  <div class="login-container">
    <div>
      <img
        src="../assets/logo.svg"
        alt="myfamilly"
        width="82"
        height="82"
        class="logo"
      />
      <img
        src="../assets/logo-text.svg"
        alt="myfamilly"
        width="125"
        height="82"
        class="logo"
      />
    </div>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <input
          placeholder="Телефон"
          type="text"
          v-model="phone"
          v-mask="'+7(###) ###-##-##'"
          class="form-group-input"
          required
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Пароль"
          type="password"
          id="password"
          v-model="password"
          required
          class="form-group-input"
        />
      </div>
      <button type="submit" class="form-button">Войти</button>
      <router-link to="/register" class="form-link">
        <button class="form-button">Регистрация</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { loginApi } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  directives: { mask },
  data() {
    return {
      phone: '',
      password: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken'])
  },
  // В вашем компоненте LoginPage.vue
  methods: {
    async handleSubmit() {
      const validPhone = this.phone.replace(/[^0-9]/g, '')
      if (validPhone.length < 11) {
        toast.error('Поле номера телефона должно быть заполнено полностью!')
        return
      }
      const userData = {
        phone: validPhone,
        password: this.password
      }
      try {
        const res = await loginApi(userData)
        this.$store.commit('setAccessToken', res.access_token)
        localStorage.setItem('isAuthenticated', 'true')
        this.$router.push({ name: 'ChatList' })
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.form {
  display: flex;
  margin-top: 20px;
  align-items: center;
  flex-direction: column;
}
.login-container {
  max-width: 450px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: linear-gradient(to bottom, #332258, rgba(221, 94, 207, 0.5));
}

.form-group {
  margin-bottom: 15px;
}
.form-group-input {
  width: 296px;
  height: 49px;
  border-radius: 15px;
  border: transparent;
  padding-left: 20px;
}
.form-group-input::placeholder {
  font-size: 16px;
}
.form-button {
  width: 97px;
  height: 40px;
  border-radius: 15px;
  border: transparent;
  background: linear-gradient(
    to right,
    #361a61,
    rgba(100, 0, 255, 0.25) 25%,
    rgba(85, 27, 174, 0.25) 25%
  );
  cursor: pointer;
  color: white;
  margin-bottom: 10px;
}
.form-link {
  text-decoration: none;
  color: inherit;
}
.form-link:hover {
  color: inherit;
  background-color: transparent;
}
</style>
