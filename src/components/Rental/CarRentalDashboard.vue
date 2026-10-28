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
          <button v-if="!isAdmin" class="primary-button" @click="activeView = 'bookings'">✨ New booking</button>
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
              <h3>🚘 Fleet status</h3>
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
              <p class="eyebrow">✨ Quick booking</p>
              <h3>🚗 Reserve your ride</h3>

              <div class="date-row">
                <div class="field-group">
                  <label for="overview-pickup-date">Borrow date</label>
                  <input id="overview-pickup-date" v-model="availabilityForm.pickupDate" type="date" :min="today" required />
                </div>
                <div class="field-group">
                  <label for="overview-pickup-time">Borrow time</label>
                  <input id="overview-pickup-time" v-model="availabilityForm.pickupTime" type="time" required />
                </div>
              </div>

              <div class="date-row">
                <div class="field-group">
                  <label for="overview-return-date">Return date</label>
                  <input id="overview-return-date" v-model="availabilityForm.dropoffDate" type="date" :min="availabilityForm.pickupDate || today" required />
                </div>
                <div class="field-group">
                  <label for="overview-return-time">Return time</label>
                  <input id="overview-return-time" v-model="availabilityForm.dropoffTime" type="time" required />
                </div>
              </div>

              <small class="form-note">Choose your actual rental dates and times to check the fleet.</small>

              <div class="field-group">
                <label for="overview-brand">Preferred brand</label>
                <select id="overview-brand" v-model="availabilityForm.brand">
                  <option>Any brand</option>
                  <option>Mazda</option>
                  <option>Toyota</option>
                  <option>Suzuki</option>
                  <option>Honda</option>
                  <option>Nissan</option>
                </select>
              </div>

              <button class="primary-button wide" type="button" @click="checkAvailability">🔎 Check availability</button>
              <p v-if="availabilityError" class="form-error" role="alert">{{ availabilityError }}</p>
              <div v-if="availabilityChecked" class="availability-results" aria-live="polite">
                <h4>{{ availableVehicles.length }} vehicle{{ availableVehicles.length === 1 ? '' : 's' }} available</h4>
                <p class="form-note">For {{ availabilityForm.pickupDate }} {{ availabilityForm.pickupTime }} to {{ availabilityForm.dropoffDate }} {{ availabilityForm.dropoffTime }}</p>
                <div v-if="availableVehicles.length" class="availability-car-list">
                  <div v-for="car in availableVehicles" :key="car.name" class="availability-car-row">
                    <span class="availability-car-icon">{{ car.icon }}</span>
                    <div class="availability-car-info"><strong>{{ car.name }}</strong><small>{{ car.brand }} · {{ car.type }} · {{ car.seats }} seats</small></div>
                    <strong>₱{{ car.price }}/day</strong>
                    <button type="button" class="secondary-button" @click="continueWithVehicle(car)">Choose</button>
                  </div>
                </div>
                <p v-else class="empty-message">No matching vehicles are available for those dates. Try another date or brand.</p>
              </div>
            </div>

          </aside>

          <section v-if="!isAdmin" class="car-browser">
            <div class="brand-filter">
              <div>
                <p class="eyebrow">🚙 Browse by brand</p>
                <h3>✨ Choose your preferred brand</h3>
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
        <div class="panel-card booking-form-card" v-if="!isAdmin">
          <p class="eyebrow">🗓️ Plan your trip</p><h2>🚘 Create a rental booking</h2>
          <p class="panel-description">Enter your renter details first, then choose your vehicle and rental schedule.</p>
          <form class="rental-form" @submit.prevent="createBooking">
            <div class="renter-info-section">
              <h3>👤 Renter Information</h3>
              <p>These details help the rental team contact you and verify your booking.</p>
            </div>
            <div class="form-field"><label for="renter-full-name">Full name</label><input id="renter-full-name" v-model.trim="bookingForm.renterName" autocomplete="name" required placeholder="Enter your full legal name" /></div>
            <div class="form-field"><label for="renter-phone">Contact number</label><input id="renter-phone" v-model.trim="bookingForm.phone" type="tel" autocomplete="tel" required placeholder="e.g. 09XX XXX XXXX" /></div>
            <div class="form-field"><label for="renter-email">Email address</label><input id="renter-email" v-model.trim="bookingForm.email" type="email" autocomplete="email" required placeholder="you@example.com" /></div>
            <div class="form-field"><label for="renter-address">Home address</label><input id="renter-address" v-model.trim="bookingForm.address" autocomplete="street-address" required placeholder="House number, street, city" /></div>
            <div class="form-field"><label for="renter-license">Driver's license number</label><input id="renter-license" v-model.trim="bookingForm.licenseNumber" required placeholder="Enter your driver's license number" /></div>
            <div class="form-field"><label for="renter-license-expiry">License expiry date</label><input id="renter-license-expiry" v-model="bookingForm.licenseExpiry" type="date" required /></div>
            <div class="renter-info-section">
              <h3>🚘 Rental Details</h3>
              <p>Choose your pickup and drop-off locations, dates, times, and preferred vehicle.</p>
            </div>
            <div class="form-field">
              <label for="pickup-location">📍 Pickup location</label>
              <select id="pickup-location" v-model="bookingForm.pickup" required>
                <option value="" disabled>Choose a pickup location</option>
                <option v-for="place in nearbyPlaces" :key="`pickup-${place.name}`" :value="place.query">{{ place.name }}</option>
                <option value="Other">Other location (enter manually)</option>
              </select>
              <input v-if="bookingForm.pickup === 'Other'" id="pickup-custom-location" v-model.trim="bookingForm.pickupCustom" required placeholder="Type your pickup address" />
            </div>
            <div class="form-field">
              <label for="dropoff-location">🏁 Drop-off location</label>
              <select id="dropoff-location" v-model="bookingForm.dropoff" required>
                <option value="" disabled>Choose a drop-off location</option>
                <option v-for="place in nearbyPlaces" :key="`dropoff-${place.name}`" :value="place.query">{{ place.name }}</option>
                <option value="Other">Other location (enter manually)</option>
              </select>
              <input v-if="bookingForm.dropoff === 'Other'" id="dropoff-custom-location" v-model.trim="bookingForm.dropoffCustom" required placeholder="Type your drop-off address" />
            </div>
            <div class="form-field"><label for="pickup-date">📅 Pickup date</label><input id="pickup-date" v-model="bookingForm.pickupDate" type="date" required /></div>
            <div class="form-field"><label for="pickup-time">⏰ Pickup time</label><input id="pickup-time" v-model="bookingForm.pickupTime" type="time" required /></div>
            <div class="form-field"><label for="dropoff-date">📅 Drop-off date</label><input id="dropoff-date" v-model="bookingForm.dropoffDate" type="date" required /></div>
            <div class="form-field"><label for="dropoff-time">⏰ Drop-off time</label><input id="dropoff-time" v-model="bookingForm.dropoffTime" type="time" required /></div>
            <div class="form-field"><label for="rental-brand">🚗 Preferred vehicle</label><select id="rental-brand" v-model="bookingForm.brand"><option>Any brand</option><option>Mazda</option><option>Toyota</option><option>Suzuki</option><option>Honda</option><option>Nissan</option></select></div>
            <div class="form-field"><label for="rental-notes">📝 Trip notes (optional)</label><input id="rental-notes" v-model.trim="bookingForm.notes" placeholder="Extra details for your booking" /></div>
            <p v-if="bookingError" class="form-error">{{ bookingError }}</p><button type="submit" class="primary-button">✅ Submit booking request</button>
          </form>
        </div>
        <div class="panel-card"><h2>📅 {{ isAdmin ? 'Booking requests' : 'Your bookings' }}</h2>
          <div class="booking-list">
            <div v-for="booking in bookings" :key="booking.id" class="booking-row">
              <div>
                <strong>{{ booking.customer }} · {{ booking.brand }}</strong>
                <span>📍 {{ booking.pickup }} → 🏁 {{ booking.dropoff }}</span>
                <span>{{ booking.notes || 'No extra notes' }}</span>
              </div>
              <span>Pickup {{ booking.pickupDate }} {{ booking.pickupTime }} · Drop-off {{ booking.dropoffDate }} {{ booking.dropoffTime }}</span>
              <span :class="['status-badge', booking.status.toLowerCase()]">{{ booking.status }}</span>
            </div><p v-if="!bookings.length" class="empty-message">🚗 No bookings yet. Create your first rental request above.</p>
          </div>
        </div>
      </section>
      <section v-else-if="activeView === 'renter-information'" class="view-section">
        <div class="panel-card">
          <p class="eyebrow">👤 Customer details</p>
          <h2>Renter Information</h2>
          <p class="panel-description">Personal and contact details are shown here separately from your rental booking schedule.</p>
          <div class="renter-profile-list">
            <article v-for="renter in renterInformation" :key="renter.id" class="renter-profile-card">
              <div class="renter-profile-header">
                <div class="renter-profile-avatar">{{ (renter.renterName || 'R').trim().charAt(0).toUpperCase() }}</div>
                <div class="renter-profile-heading">
                  <h3>{{ renter.renterName }}</h3>
                  <p>Renter ID: RNT-{{ String(renter.id).slice(-6) }}</p>
                </div>
                <span class="status-badge pending">Booking #{{ renter.bookingId }}</span>
              </div>
              <div class="renter-profile-grid">
                <div class="renter-detail"><span>📞 Contact Number</span><strong>{{ renter.phone || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>✉️ Email Address</span><strong>{{ renter.email || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>🏠 Home Address</span><strong>{{ renter.address || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>🪪 Driver's License</span><strong>{{ renter.licenseNumber || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>📅 License Expiry</span><strong>{{ renter.licenseExpiry || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>🚗 Preferred Vehicle</span><strong>{{ renter.brand || 'Any brand' }}</strong></div>
              </div>
              <div class="renter-rental-summary">
                <h4>Rental Details</h4>
                <div class="renter-profile-grid">
                  <div class="renter-detail"><span>📍 Pickup Location</span><strong>{{ renter.pickup || 'Not provided' }}</strong></div>
                  <div class="renter-detail"><span>🏁 Drop-off Location</span><strong>{{ renter.dropoff || 'Not provided' }}</strong></div>
                  <div class="renter-detail"><span>🗓️ Pickup Schedule</span><strong>{{ renter.pickupDate }} · {{ renter.pickupTime }}</strong></div>
                  <div class="renter-detail"><span>🗓️ Return Schedule</span><strong>{{ renter.dropoffDate }} · {{ renter.dropoffTime }}</strong></div>
                </div>
              </div>
            </article>
            <p v-if="!renterInformation.length" class="empty-message">👤 No renter profiles yet. Complete a booking and each renter's information will appear here as a separate profile card.</p>
          </div>
        </div>
      </section>
      <section v-else-if="activeView === 'nearby'" class="view-section">
        <div class="panel-card"><p class="eyebrow">🧭 Explore around you</p><h2>📍 Nearby places & map</h2>
          <p class="panel-description">Search for an address or place to view it on OpenStreetMap. Allow location access to use your current location.</p>
          <div class="location-search"><input v-model.trim="mapSearch" aria-label="Search map location" placeholder="Search a place or address..." @keyup.enter="openMapSearch" /><button class="primary-button" @click="openMapSearch">🔎 Search map</button><button class="secondary-button" @click="useCurrentLocation">📡 Use my location</button></div>
          <p v-if="locationMessage" class="location-message">{{ locationMessage }}</p>
          <div class="map-frame"><iframe title="OpenStreetMap location map" :src="mapEmbedUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
          <a class="map-link" :href="mapSearchUrl" target="_blank" rel="noopener noreferrer">🗺️ Open full map in OpenStreetMap ↗</a>
        </div>
        <div class="panel-card"><h2>✨ Popular places to explore</h2><p class="panel-description">Example destinations. Select one to view its map; verify the address and travel details before leaving.</p>
          <div class="places-grid"><button v-for="place in nearbyPlaces" :key="place.name" class="place-card" @click="selectNearbyPlace(place)"><span class="place-emoji">{{ place.icon }}</span><strong>{{ place.name }}</strong><span>{{ place.description }}</span><small>📍 View on map ↗</small></button></div>
        </div>
      </section>

      <section v-else-if="activeView === 'messages'" class="view-section">
        <div class="panel-card messages-panel">
          <div class="messages-heading">
            <div>
              <p class="eyebrow">💬 Stay connected</p>
              <h2>{{ isAdmin ? 'Customer Messages' : 'Messages & Support' }}</h2>
              <p class="panel-description">{{ isAdmin ? 'Open a conversation to read it and reply to the renter.' : 'Send a question about your booking or ask the rental team for help.' }}</p>
            </div>
            <span class="message-count">{{ messageThreads.length }} conversation{{ messageThreads.length === 1 ? '' : 's' }}</span>
          </div>

          <div class="messaging-layout">
            <aside class="conversation-sidebar">
              <div class="conversation-sidebar-heading"><strong>Conversations</strong></div>
              <button v-for="thread in messageThreads" :key="thread.id" class="conversation-card" :class="{ selected: selectedThreadId === thread.id }" @click="selectedThreadId = thread.id">
                <span class="conversation-avatar">{{ (isAdmin ? thread.senderName : 'Rental Support').slice(0, 1).toUpperCase() }}</span>
                <span class="conversation-summary">
                  <strong>{{ isAdmin ? thread.senderName : 'Rental Support' }}</strong>
                  <span class="conversation-subject">{{ thread.subject }}</span>
                  <small>{{ thread.messages[thread.messages.length - 1]?.text || 'No messages yet' }}</small>
                </span>
                <span v-if="thread.messages.some(m => m.senderRole !== (isAdmin ? 'admin' : 'user')) && !thread.readBy?.includes(isAdmin ? 'admin' : 'user')" class="unread-dot" aria-label="Unread message"></span>
              </button>
              <p v-if="!messageThreads.length" class="empty-message conversation-empty">No conversations yet. Send your first message below.</p>
            </aside>

            <div class="conversation-main">
              <template v-if="activeThread">
                <div class="thread-header">
                  <div class="conversation-avatar large">{{ (isAdmin ? activeThread.senderName : 'Rental Support').slice(0, 1).toUpperCase() }}</div>
                  <div><strong>{{ isAdmin ? activeThread.senderName : 'Rental Support Team' }}</strong><span>{{ activeThread.subject }}</span></div>
                </div>
                <div class="thread-messages" aria-live="polite">
                  <div v-for="(item, index) in activeThread.messages" :key="item.id || index" class="chat-bubble-wrap" :class="{ mine: item.senderRole === (isAdmin ? 'admin' : 'user') }">
                    <span class="chat-sender">{{ item.senderName }}</span>
                    <div class="chat-bubble">{{ item.text }}</div>
                    <small>{{ item.time }}</small>
                  </div>
                </div>
                <form class="message-compose" @submit.prevent="sendMessage">
                  <label class="sr-only" for="reply-message">Write a message</label>
                  <textarea id="reply-message" v-model.trim="messageDraft" rows="2" maxlength="2000" placeholder="Write your message..." required></textarea>
                  <button class="primary-button" type="submit" :disabled="!messageDraft.trim()">Send message ➤</button>
                </form>
              </template>
              <template v-else>
                <div class="new-message-placeholder">
                  <template v-if="isAdmin">
                    <span class="placeholder-icon">📭</span>
                    <h3>No customer conversations yet</h3>
                    <p>When a renter sends a message, their conversation will appear on the left. Open it to reply.</p>
                  </template>
                  <template v-else>
                    <span class="placeholder-icon">✉️</span>
                    <h3>Start a conversation</h3>
                    <p>Send a message to the rental team. Include your booking reference if you already made a reservation.</p>
                    <form class="new-message-form" @submit.prevent="startConversation">
                      <label for="message-subject">Subject</label>
                      <input id="message-subject" v-model.trim="messageSubject" maxlength="100" placeholder="e.g. Question about my booking" required />
                      <label for="first-message">Message</label>
                      <textarea id="first-message" v-model.trim="messageDraft" rows="4" maxlength="2000" placeholder="How can we help you?" required></textarea>
                      <button class="primary-button" type="submit" :disabled="!messageSubject.trim() || !messageDraft.trim()">Send to rental support ➤</button>
                    </form>
                  </template>
                </div>
              </template>
            </div>
          </div>
          <p class="messaging-note">Messages are saved in this browser for this demo. To deliver messages between different users or devices, connect this feature to the Django backend.</p>
        </div>
      </section>


    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
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
  { key: 'dashboard', label: 'Overview', icon: '🏠' },
  ...(isAdmin.value ? [{ key: 'fleet', label: 'Fleet', icon: '🚗' }] : []),
  { key: 'bookings', label: 'Bookings', icon: '📅' },
  ...(!isAdmin.value ? [{ key: 'renter-information', label: 'Renter Information', icon: '👤' }] : []),
  ...(!isAdmin.value ? [{ key: 'nearby', label: 'Nearby places', icon: '📍' }] : []),
  { key: 'messages', label: 'Messages', icon: '💬' },
])

const pageTitle = computed(() => {
  const titles = {
    dashboard: 'Overview',
    fleet: 'Fleet',
    bookings: 'Bookings',
    'renter-information': 'Renter Information',
    messages: 'Messages',
    nearby: 'Nearby places',
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

const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
const availabilityForm = ref({ pickupDate: today, pickupTime: '09:00', dropoffDate: tomorrow, dropoffTime: '18:00', brand: 'Any brand' })
const availabilityChecked = ref(false)
const availabilityError = ref('')
const bookingForm = ref({ renterName: '', phone: '', email: '', address: '', licenseNumber: '', licenseExpiry: '', pickup: '', dropoff: '', pickupCustom: '', dropoffCustom: '', pickupDate: today, pickupTime: '09:00', dropoffDate: today, dropoffTime: '18:00', brand: 'Any brand', notes: '' })
const bookingError = ref('')
const bookings = ref([])
const renterInformation = ref([])
const mapSearch = ref('Cagayan de Oro, Philippines')
const mapQuery = ref('Cagayan de Oro, Philippines')
const locationMessage = ref('')
const mapEmbedUrl = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`)
const mapSearchUrl = computed(() => `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery.value)}`)
const nearbyPlaces = [
  { name: 'Centrio Mall', icon: '🛍️', description: 'Shopping and dining', query: 'Centrio Mall, Cagayan de Oro, Philippines' },
  { name: 'Limketkai Center', icon: '🏬', description: 'Shopping and entertainment', query: 'Limketkai Center, Cagayan de Oro, Philippines' },
  { name: 'Gaston Park', icon: '🌳', description: 'City park and open space', query: 'Gaston Park, Cagayan de Oro, Philippines' },
  { name: 'Museo de Oro', icon: '🏛️', description: 'Local history and culture', query: 'Museo de Oro, Cagayan de Oro, Philippines' },
  { name: 'Macabalan Port', icon: '⛴️', description: 'Port and ferry area', query: 'Macabalan Port, Cagayan de Oro, Philippines' },
  { name: 'SM CDO Downtown Premier', icon: '🛒', description: 'Shopping and restaurants', query: 'SM CDO Downtown Premier, Cagayan de Oro, Philippines' },
]
const bookingFormDefaults = () => ({ renterName: '', phone: '', email: '', address: '', licenseNumber: '', licenseExpiry: '', pickup: '', dropoff: '', pickupCustom: '', dropoffCustom: '', pickupDate: today, pickupTime: '09:00', dropoffDate: today, dropoffTime: '18:00', brand: 'Any brand', notes: '' })
const createBooking = () => {
  bookingError.value = ''
  const pickup = bookingForm.value.pickup === 'Other' ? bookingForm.value.pickupCustom.trim() : bookingForm.value.pickup
  const dropoff = bookingForm.value.dropoff === 'Other' ? bookingForm.value.dropoffCustom.trim() : bookingForm.value.dropoff

  if (!pickup || !dropoff) {
    bookingError.value = 'Please choose or enter both pickup and drop-off locations.'
    return
  }
  if (bookingForm.value.licenseExpiry && bookingForm.value.licenseExpiry < today) {
    bookingError.value = 'Your driver’s license must not be expired.'
    return
  }
  if (bookingForm.value.dropoffDate < bookingForm.value.pickupDate || (bookingForm.value.dropoffDate === bookingForm.value.pickupDate && bookingForm.value.dropoffTime <= bookingForm.value.pickupTime)) {
    bookingError.value = 'Drop-off must be after the pickup date and time.'
    return
  }
  const bookingId = Date.now()
  const renterRecord = {
    id: bookingId,
    bookingId,
    renterName: bookingForm.value.renterName,
    phone: bookingForm.value.phone,
    email: bookingForm.value.email,
    address: bookingForm.value.address,
    licenseNumber: bookingForm.value.licenseNumber,
    licenseExpiry: bookingForm.value.licenseExpiry,
    brand: bookingForm.value.brand,
    pickup,
    dropoff,
    pickupDate: bookingForm.value.pickupDate,
    pickupTime: bookingForm.value.pickupTime,
    dropoffDate: bookingForm.value.dropoffDate,
    dropoffTime: bookingForm.value.dropoffTime,
  }
  renterInformation.value.unshift(renterRecord)
  bookings.value.unshift({
    id: bookingId,
    customer: bookingForm.value.renterName,
    renterName: bookingForm.value.renterName,
    phone: bookingForm.value.phone,
    email: bookingForm.value.email,
    address: bookingForm.value.address,
    licenseNumber: bookingForm.value.licenseNumber,
    licenseExpiry: bookingForm.value.licenseExpiry,
    pickup, dropoff,
    pickupDate: bookingForm.value.pickupDate,
    pickupTime: bookingForm.value.pickupTime,
    dropoffDate: bookingForm.value.dropoffDate,
    dropoffTime: bookingForm.value.dropoffTime,
    brand: bookingForm.value.brand,
    notes: bookingForm.value.notes,
    status: 'Pending'
  })
  bookingForm.value = bookingFormDefaults()
  activeView.value = 'renter-information'
}
const openMapSearch = () => {
  if (!mapSearch.value) return
  mapQuery.value = mapSearch.value
  locationMessage.value = `Showing map results for “${mapSearch.value}”.`
}
const selectNearbyPlace = (place) => {
  mapSearch.value = place.query
  mapQuery.value = place.query
  locationMessage.value = `Map selected: ${place.name}.`
}
const useCurrentLocation = () => {
  if (!navigator.geolocation) { locationMessage.value = 'Your browser does not support location access. Search for an address instead.'; return }
  locationMessage.value = 'Requesting your location permission…'
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    mapQuery.value = `${latitude},${longitude}`
    mapSearch.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
    locationMessage.value = '📍 Current coordinates loaded. Open the full map for nearby results.'
  }, () => { locationMessage.value = 'Location access was not available. You can search for a place manually.' }, { enableHighAccuracy: true, timeout: 10000 })
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

const availableVehicles = computed(() => {
  if (!availabilityChecked.value || availabilityError.value) return []
  const requestedStart = `${availabilityForm.value.pickupDate}T${availabilityForm.value.pickupTime}`
  const requestedEnd = `${availabilityForm.value.dropoffDate}T${availabilityForm.value.dropoffTime}`
  const brandMatches = availabilityForm.value.brand === 'Any brand'
    ? cars
    : cars.filter((car) => car.brand === availabilityForm.value.brand)
  return brandMatches.filter((car) => {
    if (car.status !== 'Available') return false
    return !bookings.value.some((booking) => {
      if (booking.status === 'Cancelled' || booking.status === 'Rejected') return false
      if (booking.brand !== 'Any brand' && booking.brand !== car.brand) return false
      const existingStart = `${booking.pickupDate}T${booking.pickupTime}`
      const existingEnd = `${booking.dropoffDate}T${booking.dropoffTime}`
      return requestedStart < existingEnd && requestedEnd > existingStart
    })
  })
})

const checkAvailability = () => {
  availabilityError.value = ''
  availabilityChecked.value = false
  const { pickupDate, pickupTime, dropoffDate, dropoffTime } = availabilityForm.value
  if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
    availabilityError.value = 'Please select both rental dates and times.'
    return
  }
  if (pickupDate < today) {
    availabilityError.value = 'The borrow date cannot be in the past.'
    return
  }
  if (dropoffDate < pickupDate || (dropoffDate === pickupDate && dropoffTime <= pickupTime)) {
    availabilityError.value = 'Return date and time must be after the borrow date and time.'
    return
  }
  availabilityChecked.value = true
}

const continueWithVehicle = (car) => {
  bookingForm.value.brand = car.brand
  bookingForm.value.pickupDate = availabilityForm.value.pickupDate
  bookingForm.value.pickupTime = availabilityForm.value.pickupTime
  bookingForm.value.dropoffDate = availabilityForm.value.dropoffDate
  bookingForm.value.dropoffTime = availabilityForm.value.dropoffTime
  activeView.value = 'bookings'
}

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

const messageStorageKey = 'motor-car-rental-message-threads'
const loadMessageThreads = () => {
  try {
    const saved = localStorage.getItem(messageStorageKey)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}
const messageThreads = ref(loadMessageThreads())
const selectedThreadId = ref(messageThreads.value[0]?.id ?? null)
const messageDraft = ref('')
const messageSubject = ref('')
const activeThread = computed(() => messageThreads.value.find(thread => thread.id === selectedThreadId.value) || null)
const formatMessageTime = () => new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
const persistMessageThreads = () => {
  try { localStorage.setItem(messageStorageKey, JSON.stringify(messageThreads.value)) } catch (error) { console.warn('Could not save messages in this browser.', error) }
}
watch(messageThreads, persistMessageThreads, { deep: true })
const startConversation = () => {
  const text = messageDraft.value.trim()
  const subject = messageSubject.value.trim()
  if (!text || !subject) return
  const id = `MSG-${Date.now()}`
  const thread = {
    id,
    subject,
    senderName: isAdmin.value ? 'Rental Support' : userName.value,
    senderRole: isAdmin.value ? 'admin' : 'user',
    readBy: [isAdmin.value ? 'admin' : 'user'],
    messages: [{ id: `${id}-1`, senderName: userName.value, senderRole: isAdmin.value ? 'admin' : 'user', text, time: formatMessageTime() }],
  }
  messageThreads.value.unshift(thread)
  selectedThreadId.value = id
  messageSubject.value = ''
  messageDraft.value = ''
}
const sendMessage = () => {
  const text = messageDraft.value.trim()
  if (!text || !activeThread.value) return
  activeThread.value.messages.push({
    id: `${activeThread.value.id}-${Date.now()}`,
    senderName: userName.value,
    senderRole: isAdmin.value ? 'admin' : 'user',
    text,
    time: formatMessageTime(),
  })
  if (!activeThread.value.readBy) activeThread.value.readBy = []
  if (!activeThread.value.readBy.includes(isAdmin.value ? 'admin' : 'user')) activeThread.value.readBy.push(isAdmin.value ? 'admin' : 'user')
  messageDraft.value = ''
}

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

.availability-results {
  margin-top: 16px;
  padding: 14px;
  border: 1px solid var(--card-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.9);
}

.availability-results h4 {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 1rem;
}

.availability-car-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.availability-car-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--card-border);
  border-radius: 10px;
  background: #fff;
}

.availability-car-icon { font-size: 1.5rem; }
.availability-car-info { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.availability-car-info small { color: var(--muted); }
.availability-car-row > strong { white-space: nowrap; font-size: .88rem; }
.availability-car-row .secondary-button { grid-column: 1 / -1; width: 100%; }

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


.panel-description { color: var(--muted); margin: 8px 0 22px; max-width: 760px; }
.rental-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }

.renter-profile-list {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
.renter-profile-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(31, 55, 90, 0.06);
}
.renter-profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}
.renter-profile-avatar {
  display: grid;
  place-items: center;
  flex: 0 0 48px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e8efff;
  color: #2448a8;
  font-size: 20px;
  font-weight: 800;
}
.renter-profile-heading { flex: 1; min-width: 0; }
.renter-profile-heading h3 { margin: 0 0 4px; color: var(--text); font-size: 17px; }
.renter-profile-heading p { margin: 0; color: var(--muted); font-size: 12px; }
.renter-profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding-top: 18px;
}
.renter-detail { min-width: 0; padding: 12px; border-radius: 12px; background: #f7f9fd; }
.renter-detail span { display: block; margin-bottom: 6px; color: var(--muted); font-size: 12px; }
.renter-detail strong { display: block; overflow-wrap: anywhere; color: var(--text); font-size: 13px; font-weight: 650; }
.renter-rental-summary { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--line); }
.renter-rental-summary h4 { margin: 0; color: var(--text); font-size: 14px; }
@media (max-width: 640px) {
  .renter-profile-card { padding: 14px; }
  .renter-profile-header { align-items: flex-start; flex-wrap: wrap; }
  .renter-profile-grid { grid-template-columns: minmax(0, 1fr); gap: 10px; }
}

.renter-info-section { grid-column: 1 / -1; padding: 15px 17px; border: 1px solid var(--line); border-radius: 13px; background: #f7faff; }
.renter-info-section h3 { margin: 0 0 5px; color: var(--text); font-size: 16px; }
.renter-info-section p { margin: 0; color: var(--muted); font-size: 13px; }
.form-field { display: flex; flex-direction: column; gap: 7px; }
.form-field label { color: #334155; font-size: 13px; font-weight: 700; }
.form-field input, .form-field select, .location-search input { width: 100%; min-width: 0; border: 1px solid var(--line); background: #fff; border-radius: 11px; padding: 12px 13px; color: var(--text); outline: none; }
.form-field input:focus, .form-field select:focus, .location-search input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(15, 111, 255, .1); }
.rental-form > .primary-button { grid-column: 1 / -1; justify-self: start; }
.form-error { color: #b91c1c; font-size: 13px; grid-column: 1 / -1; }
.location-search { display: flex; gap: 10px; align-items: center; margin: 18px 0 12px; }
.location-search input { flex: 1; }
.secondary-button { border: 1px solid var(--line); background: #f8fbff; border-radius: 12px; padding: 11px 14px; font-weight: 700; color: #24364b; cursor: pointer; white-space: nowrap; }
.location-message { color: var(--muted); font-size: 13px; margin: 8px 0 14px; }
.map-frame { width: 100%; height: 360px; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: #eef4fb; }
.map-frame iframe { width: 100%; height: 100%; border: 0; }
.map-link { display: inline-block; margin-top: 12px; color: var(--accent-dark); font-weight: 700; text-decoration: none; }
.places-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.place-card { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; text-align: left; border: 1px solid var(--line); border-radius: 15px; padding: 18px; background: #fbfdff; cursor: pointer; transition: transform .18s ease, box-shadow .18s ease; }
.place-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(24, 48, 80, .08); }
.place-emoji { font-size: 25px; }
.place-card strong { color: #1e293b; }
.place-card > span:not(.place-emoji), .place-card small { color: var(--muted); font-size: 13px; }
.place-card small { color: var(--accent-dark); font-weight: 700; }

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

  .car-card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .places-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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

  .car-grid, .data-grid, .rental-form, .places-grid { grid-template-columns: 1fr; }
  .location-search { flex-direction: column; align-items: stretch; }
  .map-frame { height: 280px; }
  .rental-form > .primary-button { width: 100%; }
}


.messages-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
.message-count { white-space: nowrap; border: 1px solid var(--line); border-radius: 999px; padding: 7px 11px; color: var(--muted); font-size: 12px; font-weight: 700; }
.messaging-layout { display: grid; grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.7fr); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; min-height: 420px; }
.conversation-sidebar { background: #f8faff; border-right: 1px solid var(--line); padding: 12px; }
.conversation-sidebar-heading { padding: 7px 8px 12px; color: var(--text); }
.conversation-card { width: 100%; display: flex; align-items: flex-start; gap: 10px; text-align: left; padding: 12px 9px; border: 1px solid transparent; border-radius: 12px; background: transparent; cursor: pointer; color: var(--text); }
.conversation-card:hover, .conversation-card.selected { background: #fff; border-color: var(--line); }
.conversation-avatar { width: 36px; height: 36px; flex: 0 0 36px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--brand-soft); color: var(--brand-dark); font-weight: 800; }
.conversation-avatar.large { width: 42px; height: 42px; flex-basis: 42px; }
.conversation-summary { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 4px; }
.conversation-summary strong { font-size: 13px; }
.conversation-subject { font-size: 12px; font-weight: 700; color: var(--text); }
.conversation-summary small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--muted); }
.unread-dot { width: 8px; height: 8px; flex: 0 0 8px; margin-top: 5px; border-radius: 50%; background: var(--brand); }
.conversation-empty { padding: 18px 6px; font-size: 13px; }
.conversation-main { min-width: 0; display: flex; flex-direction: column; background: #fff; }
.thread-header { display: flex; align-items: center; gap: 11px; padding: 15px 18px; border-bottom: 1px solid var(--line); }
.thread-header div:last-child { display: flex; flex-direction: column; gap: 4px; }
.thread-header span { color: var(--muted); font-size: 12px; }
.thread-messages { flex: 1; max-height: 340px; min-height: 230px; overflow-y: auto; padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.chat-bubble-wrap { display: flex; flex-direction: column; align-items: flex-start; max-width: 85%; gap: 4px; }
.chat-bubble-wrap.mine { align-self: flex-end; align-items: flex-end; }
.chat-sender, .chat-bubble-wrap small { font-size: 11px; color: var(--muted); }
.chat-bubble { padding: 10px 13px; border-radius: 14px 14px 14px 4px; background: #f1f5fb; color: var(--text); white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.45; }
.chat-bubble-wrap.mine .chat-bubble { background: var(--brand); color: white; border-radius: 14px 14px 4px 14px; }
.message-compose { display: flex; align-items: flex-end; gap: 10px; padding: 14px; border-top: 1px solid var(--line); }
.message-compose textarea, .new-message-form textarea, .new-message-form input { width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 11px 12px; font: inherit; color: var(--text); background: white; resize: vertical; }
.message-compose textarea { flex: 1; min-width: 0; }
.message-compose .primary-button { white-space: nowrap; }
.new-message-placeholder { max-width: 520px; width: 100%; margin: auto; padding: 28px; }
.placeholder-icon { font-size: 32px; }
.new-message-placeholder h3 { margin: 12px 0 8px; }
.new-message-placeholder p { color: var(--muted); font-size: 13px; line-height: 1.5; }
.new-message-form { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }
.new-message-form label { font-size: 12px; font-weight: 700; margin-top: 6px; }
.new-message-form .primary-button { margin-top: 8px; }
.messaging-note { margin: 12px 0 0; color: var(--muted); font-size: 11px; line-height: 1.5; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 760px) { .messaging-layout { grid-template-columns: 1fr; } .conversation-sidebar { border-right: 0; border-bottom: 1px solid var(--line); max-height: 230px; overflow-y: auto; } .message-compose { flex-direction: column; align-items: stretch; } .messages-heading { flex-direction: column; } .new-message-placeholder { padding: 20px; } }
</style>
