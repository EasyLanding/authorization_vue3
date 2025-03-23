<template>
  <div class="chat-item" @click="goToChat">
    <img :src="chat.icon" alt="Chat Icon" class="chat-icon" />
    <div class="chat-info">
      <div class="chat-info-message">
        <h3>{{ chat.name }} {{ chat.lastname }}</h3>
        <p>{{ chat.lastmessage }}</p>
      </div>
      <div v-if="chat.newMessageLength > 0" class="new-message-badge">
        {{ chat.newMessageLength }}
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
  name: 'ChatItem',
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const goToChat = () => {
      router.push(`/chat/${props.chat.id}`)
    }

    return { goToChat }
  }
}
</script>

<style scoped>
.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #21003e;
  border-radius: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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
.new-message-badge {
  background-color: rgba(221, 94, 207, 0.5);
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
