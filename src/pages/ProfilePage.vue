<template>
  <div class="profile-container">
    <div class="login-container">
      <img
        src="../assets/logo-text.svg"
        alt="myfamilly"
        width="59"
        height="20"
      />
      <img src="../assets/logo.svg" alt="myfamilly" width="29" height="28" />
    </div>
    <router-link to="/chat" class="chat-item-link">
      <--- Назад к списку чатов
    </router-link>
    <div class="profile-avatar-container">
      <img :src="profileIcons" alt="Chat Icon" class="profile-avatar" />
    </div>
    <!-- ICON -->
    <a class="profile-help-text" @click="openIcons">Редактировать картинку</a>
    <div v-if="isIcon" class="modal-overlay" @click="closeIcons">
      <div class="modal-content" @click.stop>
        <button @click="closeIcons" class="btn-close">✖️</button>
        <div class="form-container">
          <form @submit.prevent="handleSubmitIcons" class="form">
            <input
              placeholder="Введите ссылку иконки"
              class="form-group-input"
              type="text"
              v-model="profileIcons"
            />
            <p class="warning-label" v-if="!isValidLink">
              Вставляйте только ссылки на картинки, начинающиеся с https://
            </p>
            <button
              type="submit"
              class="form-button"
              :class="{ 'disabled': !isValidLink }"
              :disabled="!isValidLink"
            >
              Редактировать
            </button>
          </form>
        </div>
      </div>
    </div>

    <div class="form-data">
      <p class="form-item">Фамилия: {{ profileLastname }}</p>
      <p class="form-item">Имя: {{ profileName }}</p>
      <!-- USERNAME -->
      <div v-if="!isUsername" class="form-change-block">
        <p class="form-item">Юзернейм: {{ profileUsername }}</p>
        <button class="form-button-change" @click="openChangeUsername">
          Редактировать юзернейм
        </button>
      </div>
      <div v-if="isUsername" class="form-change-block">
        <input
          placeholder="Юзернейм"
          type="text"
          v-model="profileUsername"
          class="form-group-input"
        />
        <button class="form-button-change" @click="handleSubmitUsername">
          Редактировать
        </button>
        <button class="form-button-change" @click="closeChangeUsername">
          Выйти
        </button>
      </div>
      <!-- PHONE -->
      <div v-if="!isPhone" class="form-change-block">
        <p class="form-item">Телефон: {{ profilePhone }}</p>
        <button class="form-button-change" @click="openChangePhone">
          Редактировать телефон
        </button>
      </div>
      <div v-if="isPhone" class="form-change-block">
        <input
          placeholder="Телефон"
          type="text"
          v-model="profilePhone"
          v-mask="'+7(###) ###-##-##'"
          class="form-group-input"
        />
        <button class="form-button-change" @click="openMessagePhone">
          Редактировать
        </button>
        <button class="form-button-change" @click="closeChangePhone">
          Выйти
        </button>
      </div>
      <div
        v-if="isPhoneMessage"
        class="modal-overlay"
        @click="closeMessagePhone"
      >
        <div class="modal-content" @click.stop>
          <button @click="closeMessagePhone" class="btn-close">✖️</button>
          <div class="form-container">
            <form @submit.prevent="handleSubmitPhone" class="form">
              <h3 class="form-title">
                При редактировании телефона вас выкинет из логина!
              </h3>
              <button type="submit" class="form-button">Редактировать</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- PASSWORD -->
    <div class="profile-button_pass_name-container">
      <button class="form-button" @click="openPassword">Сменить пароль</button>
      <div v-if="isPassword" class="form-change-block">
        <input
          placeholder="Введите новый пароль"
          type="password"
          v-model="profilePassword"
          class="form-group-input"
          :minlength="8"
          maxlength="40"
          title="Минимальная длинна пароля 8 символов"
        />
        <button class="form-button-change" @click="handleSubmitPassword">
          Редактировать
        </button>
        <button class="form-button-change" @click="closePassword">Выйти</button>
      </div>
      <!-- LASTNAME AND NAME -->
      <button class="form-button" @click="openModal">
        Редактировать имя и фамилию
      </button>
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button @click="closeModal" class="btn-close">✖️</button>
          <div class="form-container">
            <form @submit.prevent="handleSubmit" class="form">
              <h3 class="form-title">Редактировать имя и фамилию</h3>
              <input
                placeholder="Фамилия"
                class="form-group-input"
                type="text"
                v-model="profileLastname"
              />
              <input
                placeholder="Имя"
                class="form-group-input"
                type="text"
                v-model="profileName"
              />
              <button type="submit" class="form-button">Редактировать</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UIHead from '../components/UIHead.vue'
import {
  updateProfileIconsApi,
  updateProfileNameApi,
  updateProfilePasswordApi,
  updateProfileUsernameApi,
  updateProfilePhoneApi,
  profileApi,
  logoutApi
} from '@/api/api'
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
export default {
  directives: { mask },
  components: {
    UIHead
  },
  name: 'ProfilePage',
  data() {
    return {
      profileId: '',
      profileLastname: '',
      profileIcons: '',
      profileName: '',
      profilePhone: '',
      profileUsername: '',
      profilePassword: '',
      isModalOpen: false,
      isUsername: false,
      isPhone: false,
      isPhoneMessage: false,
      isPassword: false,
      isIcon: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken']),
    isValidLink() {
      return this.profileIcons.startsWith('https://')
    }
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }

        const response = await profileApi(this.accessToken) // Используем токен из состояния
        // Предполагаем, что API возвращает объект с полями name и icon
        this.profileId = response.id
        this.profileName = response.name
        this.profileLastname = response.lastname
        this.profilePhone = response.phone
        this.profileUsername = response.username
        this.profileIcons = response.icons
        this.profilePassword = response.password
      } catch (error) {
        console.error('Ошибка при получении профиля:', error)
      }
    },
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
    },
    openChangeUsername() {
      this.isUsername = true
    },
    closeChangeUsername() {
      this.isUsername = false
    },
    openChangePhone() {
      this.isPhone = true
    },
    closeChangePhone() {
      this.isPhone = false
    },
    openMessagePhone() {
      this.isPhoneMessage = true
    },
    closeMessagePhone() {
      this.isPhoneMessage = false
    },
    openPassword() {
      this.isPassword = true
    },
    closePassword() {
      this.isPassword = false
    },
    openIcons() {
      this.isIcon = true
    },
    closeIcons() {
      this.isIcon = false
    },
    async handleSubmit() {
      const data = {
        lastname: this.profileLastname,
        name: this.profileName
      }

      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }
        await updateProfileNameApi(this.accessToken, data)
        toast.success('Изменение профиля успешно!')
      } catch (error) {
        toast.error(error.message)
      }
    },
    async handleSubmitUsername() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }
        await updateProfileUsernameApi(this.accessToken, {
          username: this.profileUsername
        })
        toast.success('Изменение профиля успешно!')
      } catch (error) {
        toast.error(error.message)
      }
    },
    async handleSubmitPhone() {
      try {
        const phoneData = this.profilePhone.replace(/[^0-9]/g, '')
        if (phoneData.length < 11) {
          toast.error('Поле номера телефона должно быть заполнено полностью!')
          return
        }
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }
        await updateProfilePhoneApi(this.accessToken, {
          phone: phoneData
        })
        toast.success('Изменение профиля успешно!')
        await logoutApi()
        localStorage.setItem('isAuthenticated', null)
        this.$router.push({ name: 'Login' })
      } catch (error) {
        toast.error(error.message)
      }
    },
    async handleSubmitPassword() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }
        await updateProfilePasswordApi(this.accessToken, {
          password: this.profilePassword
        })
        toast.success('Изменение профиля успешно!')
      } catch (error) {
        toast.error(error.message)
      }
    },
    async handleSubmitIcons() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }
        await updateProfileIconsApi(this.accessToken, {
          icons: this.profileIcons
        })
        toast.success('Изменение профиля успешно!')
      } catch (error) {
        toast.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  display: block;
}
.logo {
  display: flex;
  width: 100%;
}
.login-container {
  width: 100%;
  display: flex;
  align-items: center;

  margin-bottom: 10px;
}
.profile-avatar-container {
  display: flex;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  align-items: end;
}
.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 1000px;
}
.profile-help-text {
  color: white;
  font-size: 8px;
  cursor: pointer;
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
}
.profile-help-text:hover {
  border-bottom: 1px solid #87ceeb;
}
.form-item {
  color: white;
  margin-right: 5px;
}
.form-button {
  width: 142px;
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
  margin-top: 10px;

  /* Добавление теней */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

.form-button:hover {
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}
.chat-item-link {
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
.btn-close {
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: red;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}
.form-container {
  display: block;
}
.form-title {
  color: #361a61;
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
}
.form-group-input {
  width: 296px;
  height: 32px;
  border-radius: 15px;
  padding-left: 20px;
  background: #361a61;
  color: white;
  margin-right: 5px;
}
.form-group-input::placeholder {
  font-size: 16px;
}
.form-change-block {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}
.form-button-change {
  width: 142px;
  height: 32px;
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

  /* Добавление теней */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
  margin-right: 5px;
}

.form-button-change:hover {
  box-shadow: 0 10px 16px rgba(0, 0, 0, 0.5);
  transform: translateY(-2px);
}
.profile-button_pass_name-container {
  max-width: 142px;
}
.form-button.disabled {
  background-color: grey;
  cursor: not-allowed;
}
.warning-label {
  margin-top: 5px;
  margin-bottom: 5px;
  color: red;
  font-size: 12px;
}
</style>
