<template>
  <UIHead />
  <div class="chat-page-container">
    <div class="chat-page-menu"><ChatMenu /></div>
    <div class="chat-page-block">
      <div class="login-container">
        <img
          src="../assets/logo-text.svg"
          alt="myfamilly"
          width="59"
          height="20"
        />
        <img src="../assets/logo.svg" alt="myfamilly" width="29" height="28" />
      </div>
      <div class="search-container">
        <img src="../assets/search-icon.svg" alt="search" class="search-icon" />
        <input
          placeholder="Поиск по имени пользователя"
          type="text"
          v-model="username"
          class="input-search"
          pattern="[A-Za-z0-9_@.]+"
          title="Только латиница, цифры и специальные символы: _ @ ."
          maxlength="40"
        />
      </div>
      <div class="chat-list">
        <ChatItem v-for="(chat, index) in chats" :key="index" :chat="chat" />
      </div>
    </div>
  </div>
</template>

<script>
import { chatItem } from '@/constants/chat.constant'
import ChatItem from '../components/ChatItem.vue'
import ChatMenu from '@/components/ChatMenu.vue'
import UIHead from '../components/UIHead.vue'
export default {
  components: {
    ChatItem,
    ChatMenu,
    UIHead
  },
  data() {
    return {
      username: '',
      chats: chatItem
    }
  },
  methods: {}
}
</script>

<style scoped>
.chat-page-container {
  display: flex;
}
.chat-page-menu {
  width: 100%;
  max-width: 65px;
  margin-top: 100px;
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
.chat-page-block {
  width: 100%;
}
.search-container {
  position: relative;
  max-width: 332px;
}
.input-search {
  width: 338px;
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
  cursor: pointer;
}
.chat-list {
  margin-top: 20px;
  max-width: 400px;
}
</style>
