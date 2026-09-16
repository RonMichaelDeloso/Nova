<template>
  <div class="dashboard-page admin-theme">
    <aside class="sidebar">
      <div class="brand-block">
        <div class="logo-mark">
          <img :src="logoImage" alt="MOTOR & CAR Rental System logo" />
        </div>
        <div>
          <p class="brand-label">MOTOR &amp; CAR</p>
          <h2>Rental System</h2>
        </div>
      </div>

      <nav class="nav-menu">
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: currentView === item.key }"
          @click="navigate(item.path)"
        >
          <span>{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="sidebar-card">
        <p>Fleet health</p>
        <strong>96%</strong>
        <small>All vehicles are checked and ready.</small>
      </div>
    </aside>

    <main class="content-panel">
      <header class="topbar">
        <div>
          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="topbar-actions">
          <div class="search-box">
            <span>⌕</span>
            <input type="text" placeholder="Search vehicle" />
          </div>
          <div class="user-pill">
            <div class="avatar">{{ userInitials }}</div>
            <div class="user-meta">
              <span>{{ userName }}</span>
              <small>Account</small>
            </div>
          </div>
          <button class="logout-button" @click="logout">Logout</button>
        </div>
      </header>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { clearSessionUser, getSessionUser } from '../../../auth'
import logoImage from '../../../assets/logo.png'
import '../shared/rentalDashboard.css'

const router = useRouter()
const route = useRoute()
const sessionUser = getSessionUser()

const navItems = [
  { key: 'overview', label: 'Overview', icon: '⌂', path: '/dashboard/admin/overview' },
  { key: 'fleet', label: 'Fleet', icon: '🚗', path: '/dashboard/admin/fleet' },
  { key: 'bookings', label: 'Bookings', icon: '📅', path: '/dashboard/admin/bookings' },
  { key: 'messages', label: 'Messages', icon: '💬', path: '/dashboard/admin/messages' },
  { key: 'settings', label: 'Settings', icon: '⚙', path: '/dashboard/admin/settings' },
]

const currentView = computed(() => {
  const path = route.path
  if (path.includes('/fleet')) return 'fleet'
  if (path.includes('/bookings')) return 'bookings'
  if (path.includes('/messages')) return 'messages'
  if (path.includes('/settings')) return 'settings'
  return 'overview'
})

const pageTitle = computed(() => {
  const titles = {
    overview: 'Overview',
    fleet: 'Fleet',
    bookings: 'Bookings',
    messages: 'Messages',
    settings: 'Settings',
  }
  return titles[currentView.value] || 'Overview'
})

const userName = computed(() => sessionUser?.fullName || 'Admin User')
const userInitials = computed(() => {
  const name = userName.value
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'A'
  )
})

const navigate = (path) => {
  router.push(path)
}

const logout = () => {
  clearSessionUser()
  router.push('/signin')
}
</script>
