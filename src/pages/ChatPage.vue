<template>
  <div class="login-container">
    <router-link to="/chat" class="backup-button-link">
      Вернуться в список чатов
    </router-link>
    <img src="../assets/logo-text.svg" alt="myfamilly" width="59" height="20" />
    <img src="../assets/logo.svg" alt="myfamilly" width="29" height="28" />
  </div>
  <div class="chat-page-container">
    <ChatMenu />
    <div class="chat-page-message-container">
      <div class="chat-page-message">
        <div class="messages-container">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="message"
          >
            {{ name }}: {{ message.content }}
            <div>{{ message.timestamp }}</div>
          </div>
        </div>
      </div>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        class="chat-page-send-message"
        placeholder="Написать сообщение"
      />
    </div>
  </div>
</template>

<script>
import ChatMenu from '@/components/ChatMenu.vue'
import { profileApi } from '@/api/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    ChatMenu
  },
  data() {
    return {
      socket: null,
      newMessage: '',
      messages: [],
      name: ''
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'accessToken'])
  },
  mounted() {
    this.connect()
    this.fetchProfile()
  },
  methods: {
    connect() {
      this.socket = new WebSocket(`ws://localhost:8080/ws`)

      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        if (message && message.userID && message.content) {
          this.messages = [...this.messages, message]
        } else {
          console.error('Invalid message format:', message) // Лог ошибки
        }
      }

      this.socket.onclose = () => {
        console.log('WebSocket connection closed')
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    },

    sendMessage() {
      const recipientUserId = new URLSearchParams(window.location.search).get(
        'to'
      )
      const userId = this.$route.params.id
      if (
        this.newMessage.trim() &&
        this.socket &&
        this.socket.readyState === WebSocket.OPEN
      ) {
        const message = {
          userID: userId,
          content: this.newMessage,
          timestamp: new Date(),
          name: this.name,
          toUserId: recipientUserId
        }
        this.socket.send(JSON.stringify(message))
        this.messages = [...this.messages, message]
        this.newMessage = ''
      } else if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not open. Unable to send message.')
      }
    },
    async fetchProfile() {
      try {
        if (!this.accessToken) {
          throw new Error('Токен не найден')
        }

        const response = await profileApi(this.accessToken)
        this.name = `${response.name} ${response.lastname}`
      } catch (error) {
        console.error('Ошибка при получении профиля:', error)
      }
    }
  }
}
</script>

<style scoped>
.chat-page-container {
  display: flex;
}
.login-container {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.chat-page-message-container {
  width: 100%;
}
.chat-page-message {
  display: flex;
  background-color: #21003e;
  border-radius: 15px;
  height: 70vh;
  flex-grow: 1;
  margin-left: 10px;
  overflow-y: auto; /* Добавляет прокрутку */
}
.messages-container {
  display: flex;
  flex-direction: column; /* Располагаем сообщения вертикально */
  padding: 10px; /* Отступы для контейнера сообщений */
  width: 100%;
}
.message {
  background-color: rgba(221, 94, 207, 0.5); /* Фоновый цвет для сообщений */
  border-radius: 10px; /* Закругление углов */
  padding: 10px; /* Отступы внутри сообщения */
  margin-bottom: 10px; /* Отступ между сообщениями */
  width: 100%;
}
.chat-page-send-message {
  display: flex;
  background-color: #21003e;
  width: 98%;
  margin-top: 10px;
  border-radius: 10px;
  min-height: 40px;
  margin-left: 10px;
  color: white;
}
.chat-page-send-message::placeholder {
  color: white;
}
.backup-button-link {
  color: white;
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
