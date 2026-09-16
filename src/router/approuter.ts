import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../components/Authentication/SignIn.vue'
import SignUp from '../components/Authentication/SignUp.vue'
import AdminDashboard from '../components/Rental/admin/AdminDashboard.vue'
import AdminOverview from '../components/Rental/admin/AdminOverview.vue'
import AdminFleet from '../components/Rental/admin/AdminFleet.vue'
import AdminBookings from '../components/Rental/admin/AdminBookings.vue'
import AdminMessages from '../components/Rental/admin/AdminMessages.vue'
import AdminSettings from '../components/Rental/admin/AdminSettings.vue'

import UserDashboard from '../components/Rental/user/UserDashboard.vue'
import UserOverview from '../components/Rental/user/UserOverview.vue'
import UserBookings from '../components/Rental/user/UserBookings.vue'
import UserMessages from '../components/Rental/user/UserMessages.vue'
import UserSettings from '../components/Rental/user/UserSettings.vue'
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
    },
    children: [
      {
        path: '',
        redirect: '/dashboard/admin/overview'
      },
      {
        path: 'overview',
        name: 'admin-overview',
        component: AdminOverview
      },
      {
        path: 'fleet',
        name: 'admin-fleet',
        component: AdminFleet
      },
      {
        path: 'bookings',
        name: 'admin-bookings',
        component: AdminBookings
      },
      {
        path: 'messages',
        name: 'admin-messages',
        component: AdminMessages
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: AdminSettings
      }
    ]
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
    },
    children: [
      {
        path: '',
        redirect: '/dashboard/user/overview'
      },
      {
        path: 'overview',
        name: 'user-overview',
        component: UserOverview
      },
      {
        path: 'bookings',
        name: 'user-bookings',
        component: UserBookings
      },
      {
        path: 'messages',
        name: 'user-messages',
        component: UserMessages
      },
      {
        path: 'settings',
        name: 'user-settings',
        component: UserSettings
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router