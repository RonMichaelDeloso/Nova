import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../components/Authentication/SignIn.vue'
import SignUp from '../components/Authentication/SignUp.vue'
import AdminDashboard from '../components/Rental/AdminDashboard.vue'
import UserDashboard from '../components/Rental/UserDashboard.vue'
import { getSessionUser, isAuthenticated } from '../auth'

const getDashboardRoute = () => {
  const role = getSessionUser()?.role ?? 'user'
  return role === 'admin' ? '/dashboard/admin' : '/dashboard/user'
}

const routes = [
  {
    path: '/',
    redirect: '/signin'
  },
  {
    path: '/signin',
    component: SignIn,
    beforeEnter: () => {
      if (isAuthenticated()) {
        return getDashboardRoute()
      }
    }
  },
  {
    path: '/signup',
    component: SignUp,
    beforeEnter: () => {
      if (isAuthenticated()) {
        return getDashboardRoute()
      }
    }
  },
  {
    path: '/dashboard',
    redirect: () => getDashboardRoute()
  },
  {
    path: '/dashboard/admin',
    component: AdminDashboard,
    beforeEnter: () => {
      if (!isAuthenticated()) {
        return '/signin'
      }
      if (getSessionUser()?.role !== 'admin') {
        return '/dashboard/user'
      }
    }
  },
  {
    path: '/dashboard/user',
    component: UserDashboard,
    beforeEnter: () => {
      if (!isAuthenticated()) {
        return '/signin'
      }
      if (getSessionUser()?.role === 'admin') {
        return '/dashboard/admin'
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router