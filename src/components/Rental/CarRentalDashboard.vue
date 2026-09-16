<template>
  <div :class="['dashboard-page', isAdmin ? 'admin-theme' : 'user-theme']">
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
          :class="{ active: activeView === item.key }"
          @click="activeView = item.key"
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
          <button v-if="!isAdmin" class="primary-button">New booking</button>
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

      <section v-if="activeView === 'dashboard'" class="view-section">
        <section v-if="isAdmin" class="stats-grid">
          <article v-for="stat in dashboardStats" :key="stat.label" class="stat-card">
            <span class="stat-label">{{ stat.label }}</span>
            <strong>{{ stat.value || 0 }}</strong>
            <small>{{ stat.note || 0 }}</small>
          </article>
        </section>

        <section class="main-grid">
          <div v-if="isAdmin" class="fleet-section">
            <div class="section-header">
              <h3>Fleet status</h3>
              <button>View all</button>
            </div>

            <div class="admin-list">
              <div
                v-for="vehicle in fleetAssignments"
                :key="vehicle.id"
                class="admin-vehicle-row"
                :class="{ expanded: expandedVehicleId === vehicle.id }"
                @click="toggleVehicle(vehicle.id)"
              >
                <div class="vehicle-main">
                  <span class="vehicle-badge" :class="vehicle.status === 'Booked' ? 'booked' : 'available'">{{ vehicle.status }}</span>
                  <div>
                    <strong>{{ vehicle.model }}</strong>
                    <small>{{ vehicle.type }}</small>
                  </div>
                </div>
                <div class="driver-info">
                  <strong>{{ vehicle.driver }}</strong>
                  <small>{{ vehicle.phone }}</small>
                </div>
                <div class="trip-time">
                  <strong>{{ vehicle.borrowDate }} · {{ vehicle.borrowTime }}</strong>
                  <small>Return by {{ vehicle.returnDate }} · {{ vehicle.returnTime }}</small>
                </div>

                <div v-if="expandedVehicleId === vehicle.id" class="vehicle-details">
                  <div>
                    <span class="detail-label">Driver name</span>
                    <strong>{{ vehicle.driver }}</strong>
                  </div>
                  <div>
                    <span class="detail-label">Contact</span>
                    <strong>{{ vehicle.phone }}</strong>
                  </div>
                  <div>
                    <span class="detail-label">Rental period</span>
                    <strong>{{ vehicle.borrowDate }} {{ vehicle.borrowTime }} - {{ vehicle.returnDate }} {{ vehicle.returnTime }}</strong>
                  </div>
                  <div>
                    <span class="detail-label">Borrow / return location</span>
                    <strong>{{ vehicle.route }}</strong>
                  </div>
                  <div>
                    <span class="detail-label">Status</span>
                    <strong>{{ vehicle.status }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside v-if="!isAdmin" class="booking-panel">
            <div class="booking-card">
              <p class="eyebrow">Quick booking</p>
              <h3>Reserve your ride</h3>

              <div class="date-row">
                <div class="field-group">
                  <label>Borrow date</label>
                  <input type="date" value="2026-09-18" />
                </div>
                <div class="field-group">
                  <label>Borrow time</label>
                  <input type="time" value="09:30" />
                </div>
              </div>

              <div class="date-row">
                <div class="field-group">
                  <label>Return date</label>
                  <input type="date" value="2026-09-22" />
                </div>
                <div class="field-group">
                  <label>Return time</label>
                  <input type="time" value="18:00" />
                </div>
              </div>

              <small class="form-note">The car must be returned by the selected date and time.</small>

              <div class="field-group">
                <label>Preferred brand</label>
                <select>
                  <option>Any brand</option>
                  <option>Mazda</option>
                  <option>Toyota</option>
                  <option>Suzuki</option>
                  <option>Honda</option>
                  <option>Nissan</option>
                </select>
              </div>

              <button class="primary-button wide">Check availability</button>
            </div>

          </aside>

          <section v-if="!isAdmin" class="car-browser">
            <div class="brand-filter">
              <div>
                <p class="eyebrow">Browse by brand</p>
                <h3>Choose your preferred brand</h3>
              </div>
              <div class="brand-filter-options">
                <button
                  v-for="brand in brandFilters"
                  :key="brand"
                  :class="{ active: selectedBrand === brand }"
                  :aria-pressed="selectedBrand === brand"
                  @click="selectedBrand = brand"
                >
                  {{ brand }}
                </button>
              </div>
            </div>

            <div class="car-card-grid">
            <article v-for="car in filteredCars" :key="car.name" class="car-card">
              <div class="car-card-header">
                <div>
                  <p class="eyebrow">Available vehicle</p>
                  <h3>{{ car.name }}</h3>
                  <span>{{ car.brand }} · {{ car.type }}</span>
                </div>
                <span :class="['status-badge', car.status === 'Available' ? 'confirmed' : 'pending']">{{ car.status }}</span>
              </div>
              <div class="car-illustration">{{ car.icon }}</div>
              <div class="car-card-footer">
                <strong>₱{{ car.price }}<small>/day</small></strong>
                <div class="car-specs">
                  <span>{{ car.transmission }}</span>
                  <span>{{ car.seats }} seats</span>
                  <span>{{ car.fuel }}</span>
                </div>
              </div>
            </article>
            </div>
          </section>
        </section>
      </section>

      <section v-else-if="activeView === 'fleet'" class="view-section">
        <div class="panel-card">
          <h2>Fleet overview</h2>
          <div class="data-grid">
            <div v-for="stat in fleetStats" :key="stat.label" class="data-card">
              <span>{{ stat.label }}</span>
              <strong>{{ stat.value || 0 }}</strong>
              <small>{{ stat.note || 0 }}</small>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <h3>Vehicle inventory</h3>
          <div class="booking-list">
            <div v-for="car in cars" :key="car.name" class="booking-row">
              <div>
                <strong>{{ car.name }}</strong>
                <span>{{ car.type }}</span>
              </div>
              <span>{{ car.status }}</span>
              <span>₱{{ car.price }}/day</span>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="activeView === 'bookings'" class="view-section">
        <div class="panel-card">
          <h2>Bookings</h2>
          <div class="booking-list">
            <div v-for="booking in bookings" :key="booking.id" class="booking-row">
              <div>
                <strong>{{ booking.customer }}</strong>
                <span>{{ booking.route }}</span>
              </div>
                <span>Borrow {{ booking.borrowDate }} {{ booking.borrowTime }} · Return {{ booking.returnDate }} {{ booking.returnTime }}</span>
              <span :class="['status-badge', booking.status.toLowerCase()]">{{ booking.status }}</span>
            </div>
              <p v-if="!bookings.length" class="empty-message">No bookings yet.</p>
          </div>
        </div>
      </section>

      <section v-else-if="activeView === 'messages'" class="view-section">
        <div class="panel-card">
          <h2>Messages</h2>
          <div class="message-list">
            <div v-for="message in messages" :key="message.name" class="message-item">
              <div>
                <strong>{{ message.name }}</strong>
                <span>{{ message.preview }}</span>
              </div>
              <span>{{ message.time }}</span>
              <span :class="['status-badge', message.type]">{{ message.typeLabel }}</span>
            </div>
            <p v-if="!messages.length" class="empty-message">No messages yet.</p>
          </div>
        </div>
      </section>

      <section v-else-if="activeView === 'settings'" class="view-section">
        <div class="panel-card">
          <h2>Business settings</h2>
          <div class="setting-list">
            <div v-for="setting in settings" :key="setting.label" class="setting-item">
              <div>
                <strong>{{ setting.label }}</strong>
                <span>{{ setting.note }}</span>
              </div>
              <div :class="['switch', { on: setting.enabled }]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clearSessionUser, getSessionUser } from '../../auth'
import logoImage from '../../assets/logo.png'

const props = defineProps({
  role: {
    type: String,
    default: 'user',
  },
})

const router = useRouter()
const sessionUser = getSessionUser()
const activeView = ref('dashboard')
const expandedVehicleId = ref(null)
const isAdmin = computed(() => props.role === 'admin' || sessionUser?.role === 'admin')

const navItems = computed(() => [
  { key: 'dashboard', label: 'Overview', icon: '⌂' },
  ...(isAdmin.value ? [{ key: 'fleet', label: 'Fleet', icon: '🚗' }] : []),
  { key: 'bookings', label: 'Bookings', icon: '📅' },
  { key: 'messages', label: 'Messages', icon: '💬' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
])

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Overview',
    fleet: 'Fleet',
    bookings: 'Bookings',
    messages: 'Messages',
    settings: 'Settings',
  }
  return titles[activeView.value] || 'Overview'
})
const userName = computed(() => sessionUser?.fullName || (isAdmin.value ? 'Admin User' : 'Driver'))
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'D'
})

const toggleVehicle = (vehicleId) => {
  expandedVehicleId.value = expandedVehicleId.value === vehicleId ? null : vehicleId
}

const logout = () => {
  clearSessionUser()
  router.push('/signin')
}

const cars = [
  { name: 'Mazda 3', brand: 'Mazda', type: 'Compact Sedan', price: 85, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '🚘', tint: 'blue' },
  { name: 'Toyota Camry', brand: 'Toyota', type: 'Comfort Sedan', price: 95, transmission: 'Automatic', seats: 5, fuel: 'Hybrid', status: 'Available', icon: '🚙', tint: 'navy' },
  { name: 'Suzuki Ertiga', brand: 'Suzuki', type: 'Family MPV', price: 80, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '🚙', tint: 'slate' },
  { name: 'Honda Civic', brand: 'Honda', type: 'Sport Sedan', price: 105, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '🚗', tint: 'sky' },
  { name: 'Nissan X-Trail', brand: 'Nissan', type: 'Luxury SUV', price: 125, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '🚘', tint: 'blue' },
]

const selectedBrand = ref('Any brand')
const brandFilters = ['Any brand', 'Mazda', 'Toyota', 'Suzuki', 'Honda', 'Nissan']
const filteredCars = computed(() => selectedBrand.value === 'Any brand'
  ? cars
  : cars.filter((car) => car.brand === selectedBrand.value))

const trips = [
  { name: 'Jenna Cooper', borrowDate: 'Sep 18', borrowTime: '09:30', returnDate: 'Sep 22' },
  { name: 'Victor Lee', borrowDate: 'Sep 20', borrowTime: '12:15', returnDate: 'Sep 24' },
  { name: 'Alicia Moss', borrowDate: 'Sep 22', borrowTime: '15:40', returnDate: 'Sep 26' },
]

const fleetAssignments = [
  { id: 1, model: 'Tesla Model 3', type: 'Electric', status: 'Booked', driver: 'Jenna Cooper', phone: '+1 415 555 0182', borrowDate: 'Sep 18', borrowTime: '09:30', returnDate: 'Sep 22', returnTime: '18:00', route: 'Downtown → Airport' },
  { id: 2, model: 'BMW 3 Series', type: 'Executive', status: 'Available', driver: 'Unassigned', phone: '—', borrowDate: 'Available', borrowTime: '—', returnDate: '—', returnTime: '—', route: 'Ready for booking' },
  { id: 3, model: 'Range Rover', type: 'Luxury SUV', status: 'Booked', driver: 'Victor Lee', phone: '+1 415 555 0154', borrowDate: 'Sep 20', borrowTime: '12:15', returnDate: 'Sep 24', returnTime: '17:00', route: 'City Center → Old Town' },
  { id: 4, model: 'Mercedes C-Class', type: 'Premium', status: 'Available', driver: 'Unassigned', phone: '—', borrowDate: 'Available', borrowTime: '—', returnDate: '—', returnTime: '—', route: 'Ready for booking' },
]

const dashboardStats = computed(() => {
  if (isAdmin.value) {
    return [
      { label: 'Available cars', value: '36', note: '+8 from last week' },
      { label: 'Bookings', value: '18', note: '5 pending pickup' },
      { label: 'Revenue', value: '₱42.5k', note: '+12.4% this month' },
      { label: 'Customer rating', value: '4.9', note: 'Based on 284 reviews' },
    ]
  }

  return [
    { label: 'Upcoming rentals', value: '3', note: '2 confirmed' },
    { label: 'Rentals this month', value: '12', note: '5 new bookings' },
    { label: 'Loyalty points', value: '840', note: 'Upgrade available' },
    { label: 'Membership', value: 'Gold', note: 'Priority assistance' },
  ]
})

const fleetStats = [
  { label: 'Active vehicles', value: '36', note: 'Operational today' },
  { label: 'Idle vehicles', value: '8', note: 'Waiting for pickup' },
  { label: 'Maintenance', value: '3', note: 'Due this week' },
]

const bookings = []

const messages = []

const settings = [
  { label: 'Auto-confirm bookings', note: 'Send instant confirmation to customers', enabled: true },
  { label: 'Document reminders', note: 'Remind customers before pickup', enabled: true },
  { label: 'Late return alerts', note: 'Notify managers on return issues', enabled: false },
]
</script>

<style scoped>
:root {
  --brand: #0f6fff;
  --brand-dark: #0a56c9;
  --brand-soft: #eaf3ff;
  --surface: #ffffff;
  --panel: #f4f7fb;
  --text: #1b2430;
  --muted: #6d7b8d;
  --line: #dfe7f2;
  --success: #1bbf7a;
  --warning: #ffb648;
}

.dashboard-page {
  --accent: #0f6fff;
  --accent-dark: #0a56c9;
  --accent-soft: #eaf3ff;
  --sidebar-bg: #0f172a;
  --sidebar-text: #ffffff;
  --sidebar-muted: rgba(255, 255, 255, 0.7);
  --page-bg: linear-gradient(135deg, #edf4ff 0%, #f7f9fc 100%);
  --card-bg: rgba(255, 255, 255, 0.82);
  --card-border: #dfe7f2;
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--page-bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
}

.dashboard-page.admin-theme,
.dashboard-page.user-theme {
  --accent: #0f6fff;
  --accent-dark: #0a56c9;
  --accent-soft: #edf6ff;
  --sidebar-bg: #14283d;
  --sidebar-text: #edf5ff;
  --sidebar-muted: rgba(237, 245, 255, 0.72);
  --page-bg: linear-gradient(135deg, #f2f7ff 0%, #f9fbff 100%);
  --card-bg: rgba(255, 255, 255, 0.88);
  --card-border: #dfe8f7;
}

.sidebar {
  width: 260px;
  flex: 0 0 260px;
  height: 100vh;
  overflow-y: auto;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
}

.admin-theme .sidebar,
.user-theme .sidebar {
  background: linear-gradient(180deg, #0d1728 0%, #12213a 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: inset -1px 0 0 rgba(255,255,255,0.04);
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-mark {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
}

.logo-mark img,
.logo-circle img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: inherit;
}

.brand-label {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sidebar-muted);
  white-space: nowrap;
}

.brand-block h2 {
  margin: 2px 0 0;
  font-size: 17px;
  line-height: 1.1;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  width: 100%;
  background: transparent;
  color: var(--sidebar-text);
  opacity: 0.82;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  opacity: 1;
  background: rgba(148, 163, 184, 0.08);
}

.nav-item.active {
  background: rgba(15, 111, 255, 0.12);
  color: var(--sidebar-text);
  opacity: 1;
  box-shadow: inset 0 0 0 1px rgba(15, 111, 255, 0.08);
}

.user-theme .nav-item.active {
  background: rgba(15, 111, 255, 0.12);
  box-shadow: inset 0 0 0 1px rgba(15, 111, 255, 0.08);
}

.sidebar-card {
  margin-top: auto;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px;
}

.user-theme .sidebar-card {
  background: rgba(15, 111, 255, 0.05);
}

.sidebar-card p,
.sidebar-card small {
  color: var(--sidebar-muted);
}

.sidebar-card strong {
  display: block;
  font-size: 28px;
  margin: 10px 0;
}

.content-panel {
  flex: 1;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 30px 36px 40px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 8px;
}

.topbar h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1.1;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 220px;
}

.search-box input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 14px;
}

.primary-button {
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(15, 111, 255, 0.22);
}

.user-theme .primary-button {
  background: linear-gradient(135deg, #0f6fff, #0a56c9);
  box-shadow: 0 12px 24px rgba(15, 111, 255, 0.22);
}

.wide {
  width: 100%;
  margin-top: 6px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #dfeeff;
  color: var(--brand-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 111, 255, 0.08);
  border: 1px solid rgba(15, 111, 255, 0.15);
  border-radius: 999px;
  padding: 6px 12px 6px 6px;
  font-weight: 600;
  color: var(--text);
}

.user-theme .user-pill {
  background: rgba(15, 111, 255, 0.08);
  border-color: rgba(15, 111, 255, 0.15);
}

.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.user-meta small {
  color: var(--muted);
  font-size: 11px;
}

.logout-button {
  border: none;
  background: #111827;
  color: white;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 18px;
  padding: 20px 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
}

.admin-theme .stat-card,
.user-theme .stat-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,247,255,0.92));
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.admin-theme .stat-card::before,
.user-theme .stat-card::before {
  content: '';
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #0f6fff, #93c5fd);
}

.stat-label {
  color: var(--muted);
  font-size: 13px;
}

.stat-card strong {
  display: block;
  font-size: 2rem;
  margin: 10px 0 8px;
}

.stat-card small {
  color: var(--muted);
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(290px, 0.9fr);
  gap: 22px;
}

.user-theme .main-grid {
  display: flex;
  flex-direction: column;
}

.user-theme .booking-panel {
  order: -1;
}

.admin-theme .fleet-section {
  grid-column: 1 / -1;
}

.admin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.admin-vehicle-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr 0.8fr;
  align-items: center;
  gap: 16px;
  background: #f8fbff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-vehicle-row.expanded {
  box-shadow: 0 10px 18px rgba(15, 111, 255, 0.08);
  border-color: rgba(15, 111, 255, 0.18);
}

.vehicle-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vehicle-main strong,
.driver-info strong,
.trip-time strong {
  display: block;
}

.vehicle-main small,
.driver-info small,
.trip-time small {
  color: var(--muted);
}

.vehicle-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.vehicle-badge.booked {
  background: rgba(15, 111, 255, 0.1);
  color: var(--brand-dark);
}

.vehicle-badge.available {
  background: rgba(27, 191, 122, 0.12);
  color: #188a5b;
}

.vehicle-details {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.detail-label {
  display: block;
  color: var(--muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.fleet-section,
.booking-card,
.activity-card,
.panel-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.admin-theme .fleet-section,
.admin-theme .booking-card,
.admin-theme .activity-card,
.admin-theme .panel-card,
.user-theme .fleet-section,
.user-theme .booking-card,
.user-theme .activity-card,
.user-theme .panel-card {
  background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246,250,255,0.94));
  border-color: rgba(148, 163, 184, 0.18);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
}

.fleet-section {
  padding: 22px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 1.2rem;
}

.section-header button {
  background: transparent;
  border: none;
  color: var(--brand-dark);
  font-weight: 700;
}

.filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

.filter {
  border: 1px solid var(--line);
  background: white;
  border-radius: 999px;
  padding: 8px 14px;
  color: var(--muted);
}

.filter.selected {
  background: var(--brand-soft);
  border-color: rgba(15, 111, 255, 0.2);
  color: var(--brand-dark);
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.car-card {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;
}

.car-visual {
  height: 120px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin-bottom: 14px;
}

.car-visual.blue { background: linear-gradient(135deg, #dfeeff, #cfe1ff); }
.car-visual.navy { background: linear-gradient(135deg, #ecf2ff, #dfeaff); }
.car-visual.slate { background: linear-gradient(135deg, #eef2f8, #dfe7f4); }
.car-visual.sky { background: linear-gradient(135deg, #e9f7ff, #d9f0ff); }

.car-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.car-header h4 {
  font-size: 1.07rem;
  margin-bottom: 2px;
}

.car-header small {
  color: var(--muted);
}

.price {
  color: var(--brand-dark);
  font-weight: 700;
  font-size: 0.92rem;
}

.car-meta {
  list-style: none;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--muted);
  font-size: 12px;
  padding: 0;
  margin: 16px 0;
}

.car-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.status {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status.available {
  background: rgba(27, 191, 122, 0.12);
  color: #188a5b;
}

.status.booked {
  background: rgba(255, 182, 72, 0.15);
  color: #a66f00;
}

.car-footer button {
  border: none;
  background: var(--brand-soft);
  color: var(--brand-dark);
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 700;
}

.booking-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.car-card-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.car-browser {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand-filter {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  padding: 4px 2px;
}

.brand-filter h3 {
  margin: 0;
}

.brand-filter-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.brand-filter-options button {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 9px 13px;
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.brand-filter-options button.active,
.brand-filter-options button:hover {
  border-color: var(--brand);
  background: var(--brand);
  color: #082b58;
}

.brand-filter-options button.active {
  box-shadow: 0 5px 12px rgba(15, 111, 255, 0.24);
  transform: translateY(-1px);
}

.brand-filter-options button:focus-visible {
  outline: 3px solid rgba(15, 111, 255, 0.24);
  outline-offset: 2px;
}

.car-card {
  padding: 22px;
  background: linear-gradient(145deg, #eaf3ff, #ffffff 62%);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

.car-card-header,
.car-card-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.car-card-header {
  flex-direction: column;
  gap: 8px;
}

.car-card-header .status-badge {
  align-self: flex-start;
}

.car-card h3 {
  margin: 0 0 4px;
}

.car-card-header > div > span {
  color: var(--muted);
  font-size: 13px;
}

.car-illustration {
  display: grid;
  place-items: center;
  min-height: 130px;
  margin: 18px 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.72);
  font-size: 54px;
}

.car-card-footer {
  align-items: center;
}

.car-card-footer strong {
  color: var(--text);
  font-size: 22px;
}

.car-card-footer strong small {
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.car-specs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
}

.car-specs span {
  padding: 7px 9px;
  border-radius: 9px;
  background: var(--brand-soft);
  color: var(--brand-dark);
  font-size: 11px;
  font-weight: 700;
}

.booking-card,
.activity-card {
  padding: 20px;
}

.booking-card h3,
.activity-card h3,
.panel-card h2,
.panel-card h3 {
  margin-top: 0;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.field-group label {
  font-size: 12px;
  color: var(--muted);
}

.field-group input,
.field-group select {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fbff;
  font-size: 14px;
  color: var(--text);
}

.date-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.form-note {
  display: block;
  margin: -4px 0 16px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.4;
}

.section-header.compact {
  margin-bottom: 18px;
}

.section-header.compact span {
  color: var(--brand-dark);
  font-weight: 700;
  font-size: 12px;
}

.trip-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.trip-item:first-child {
  border-top: none;
}

.trip-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4da1ff, #0f6fff);
}

.trip-item strong,
.trip-item small {
  display: block;
}

.trip-item small {
  color: var(--muted);
  margin-top: 4px;
}

.trip-item span {
  margin-left: auto;
  color: var(--brand-dark);
  font-weight: 700;
  font-size: 12px;
}

.view-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-card {
  padding: 24px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.data-card {
  background: #f7fafe;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 18px;
}

.data-card strong {
  display: block;
  font-size: 1.6rem;
  margin: 12px 0 6px;
}

.message-list,
.booking-list,
.setting-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-message {
  margin: 0;
  color: #111827;
  font-weight: 700;
  text-align: center;
}

.message-item,
.booking-row,
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: #f9fbff;
  border: 1px solid var(--line);
  border-radius: 14px;
}

.message-item strong,
.booking-row strong,
.setting-item strong {
  display: block;
}

.message-item span,
.booking-row span,
.setting-item span {
  color: var(--muted);
  font-size: 13px;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.status-badge.pending {
  background: rgba(255, 182, 72, 0.12);
  color: #a66f00;
}

.status-badge.confirmed {
  background: rgba(27, 191, 122, 0.12);
  color: #188a5b;
}

.status-badge.new {
  background: rgba(15, 111, 255, 0.12);
  color: var(--brand-dark);
}

.switch {
  width: 46px;
  height: 26px;
  border-radius: 999px;
  background: #dfe7f2;
  position: relative;
}

.switch::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 4px;
  left: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

.switch.on {
  background: #0f6fff;
}

.switch.on::after {
  left: 24px;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .data-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .car-card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .dashboard-page {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .sidebar {
    width: 100%;
    flex: initial;
    height: auto;
    overflow: visible;
  }

  .content-panel {
    height: auto;
    overflow: visible;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .car-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .brand-filter {
    align-items: flex-start;
    flex-direction: column;
  }

  .brand-filter-options {
    justify-content: flex-start;
  }

  .search-box {
    flex: 1;
    min-width: 0;
  }

  .car-grid,
  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>
