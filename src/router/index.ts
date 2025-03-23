import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/store'
import LoginPage from '../pages/LoginPage.vue'
import RegistrationPage from '../pages/RegistrationPage.vue'
import ChatListPage from '@/pages/ChatListPage.vue'
import ChatPage from '@/pages/ChatPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegistrationPage },
  { path: '/chat', name: 'ChatList', component: ChatListPage },
  { path: '/chat/:id', name: 'Chat', component: ChatPage },
  { path: '/profile', name: 'Profile', component: ProfilePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (
    !JSON.parse(isAuthenticated) &&
    to.name !== 'Login' &&
    to.name !== 'Register'
  ) {
    next({ name: 'Login' })
    return
  }
  if (to.name !== 'Login' && to.name !== 'Register' && isAuthenticated) {
    try {
      await store.dispatch('refreshToken')
    } catch (error) {
      next({ name: 'Login' })
      return
    }
  }

  next()
})

export default router
