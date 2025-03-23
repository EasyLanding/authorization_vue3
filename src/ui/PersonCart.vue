<template>
  <div class="chat-item">
    <div class="chat-item-info">
      <img :src="person.icon" alt="Chat Icon" class="chat-icon" />
      <div class="chat-info">
        <div class="chat-info-message">
          <h3>{{ person.name }} {{ person.lastname }}</h3>
        </div>
      </div>
    </div>
    <button @click="navigateToChat" class="chat-item-link">
      Написать сообщение
    </button>
  </div>
</template>

<script>
import { profileApi } from '@/api/api'
import { mapGetters } from 'vuex'
export default {
  name: 'PersonCart',
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      myId: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken'])
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    navigateToChat() {
      this.$router.push(`/chat/${this.myId}?to=${this.person.id}`)
    },
    async fetchProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }

        const response = await profileApi(this.accessToken)
        this.myId = response.id
      } catch (error) {
        console.error('Ошибка при получении профиля:', error)
      }
    }
  }
}
</script>

<style scoped>
.chat-item {
  display: flex;
  padding: 10px;
  background-color: #21003e;
  border-radius: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  justify-content: space-between;
}
.chat-item-info {
  display: flex;
  align-items: center;
}
.chat-icon {
  width: 40px;
  height: auto;
  margin-right: 10px;
}
.chat-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.chat-info-message {
  color: #fff;
}
.chat-item-link {
  color: white;
  font-size: 12px;
  max-width: 140px;
  display: flex;
  align-items: center;
  background: none;
  border: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
}
.chat-item-link:hover {
  border-bottom: 1px solid white;
}
</style>
