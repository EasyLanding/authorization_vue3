<template>
  <div class="chat-menu">
    <img
      src="../assets/profile-icon.svg"
      alt="Новый чат"
      class="chat-icon"
      @click="profileHanddler"
    />
    <p class="chat-icon-text">Профиль</p>
    <img
      src="../assets/new-chat-icon.svg"
      alt="Новый чат"
      class="chat-icon"
      @click="openModal"
    />
    <p class="chat-icon-text">Новый чат</p>
  </div>
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="search-container">
          <img
            src="../assets/search-icon.svg"
            alt="search"
            class="search-icon"
          />
          <input
            placeholder="Поиск нового пользователя"
            type="text"
            v-model="username"
            @input="debouncedSearchUsers"
            class="input-search"
            pattern="[A-Za-z0-9_@.]+"
            title="Только латиница, цифры и специальные символы: _ @ ."
            maxlength="40"
          />
        </div>
        <button @click="closeModal" class="btn-close">✖️</button>
      </div>
      <PersonCart
        v-for="person in users"
        :key="person.id"
        :person="{
          icon: person.icons,
          name: person.name,
          lastname: person.lastname,
          id: person.id
        }"
      />
    </div>
  </div>
</template>

<script>
import PersonCart from '@/ui/PersonCart.vue'
import { debounce } from 'lodash'
import { searchUsersApi } from '@/api/api'
import { mapGetters } from 'vuex'
export default {
  components: {
    PersonCart
  },
  data() {
    return {
      username: '',
      isModalOpen: false,
      users: []
    }
  },
  created() {
    this.debouncedSearchUsers = debounce(this.searchUsers, 300)
  },
  mounted() {
    this.getUsers()
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken'])
  },
  methods: {
    openModal() {
      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.username = ''
    },
    profileHanddler() {
      this.$router.push({ name: 'Profile' })
    },
    async searchUsers() {
      try {
        const response = await searchUsersApi(this.accessToken, this.username)
        this.users = response
      } catch (error) {
        console.error('Ошибка при поиске пользователей:', error)
        this.users = []
      }
    },
    async getUsers() {
      try {
        const response = await searchUsersApi(this.accessToken)
        this.users = response
      } catch (error) {
        console.error('Ошибка при поиске пользователей:', error)
        this.users = []
      }
    }
  }
}
</script>

<style scoped>
.chat-icon {
  width: 40px;
  height: auto;
  cursor: pointer;
}
.chat-icon-text {
  font-size: 11px;
  color: white;
  margin-bottom: 5px;
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
}
.modal-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 20px;
}
.btn-close {
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: red;
  cursor: pointer;
}

.search-container {
  position: relative;
}

.input-search {
  min-width: 332px;
  width: calc(100% - 30px);
  height: 40px;
  border-radius: 5px;
  padding-left: 10px;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: auto;
}
</style>
