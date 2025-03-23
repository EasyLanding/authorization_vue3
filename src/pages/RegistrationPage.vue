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
          placeholder="Имя пользователя"
          type="text"
          v-model="username"
          class="form-group-input"
          pattern="[A-Za-z0-9_@.]+"
          title="Только латиница, цифры и специальные символы: _ @ ."
          maxlength="40"
          required
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Телефон"
          type="text"
          v-model="phone"
          v-mask="'+7(###) ###-##-##'"
          class="form-group-input"
          maxlength="17"
          required
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Имя"
          type="text"
          id="name"
          v-model="name"
          required
          class="form-group-input"
          maxlength="40"
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Фамилия"
          type="text"
          id="lastname"
          v-model="lastname"
          required
          class="form-group-input"
          maxlength="40"
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
          minlength="8"
          maxlength="40"
          title="Минимальная длинна пароля 8 символов"
        />
      </div>
      <div class="form-group">
        <input
          placeholder="Повторите пароль"
          type="password"
          id="repeat_password"
          v-model="repeat_password"
          required
          class="form-group-input"
          minlength="8"
          maxlength="40"
          title="Минимальная длинна пароля 8 символов"
        />
      </div>
      <button type="submit" class="form-button">Зарегистрироваться</button>

      <router-link to="/" class="form-link">
        <button class="form-button">Вернуться к логину</button>
      </router-link>
    </form>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { registerApi } from '@/api/api'

export default {
  directives: { mask },
  data() {
    return {
      username: '',
      phone: '',
      name: '',
      lastname: '',
      password: '',
      repeat_password: ''
    }
  },
  methods: {
    async handleSubmit() {
      if (this.password !== this.repeat_password) {
        toast.error('Пароли не совпадают')
        return
      }
      const validPhone = this.phone.replace(/[^0-9]/g, '')
      if (validPhone.length < 11) {
        toast.error('Поле номера телефона должно быть заполнено полностью!')
        return
      }
      const userData = {
        username: this.username,
        phone: validPhone,
        name: this.name,
        lastname: this.lastname,
        password: this.password
      }
      try {
        await registerApi(userData)
        toast.success('Регистрация прошла успешно!')
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
  width: 175px;
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
