import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '@/components/Authentication/SignIn.vue'
import SignUp from '@/components/Authentication/SignUp.vue'

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    component: SignIn
  },
  {
    path: '/signup',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router