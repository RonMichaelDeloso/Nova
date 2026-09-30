<template>
  <div class="view-section">
    <div class="panel-card">
      <div class="header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Bookings</h2>
        <button class="secondary-button" style="padding: 6px 12px; font-size: 12px;" @click="loadBookings">Refresh</button>
      </div>
      <div class="booking-list">
        <div v-for="booking in bookings" :key="booking.id" class="booking-row">
          <div>
            <strong>{{ booking.customer || booking.customerName || 'Customer' }}</strong>
            <span>{{ booking.vehicleName || booking.carName || 'Vehicle' }} · {{ booking.pickupLocation || 'Main Office' }}</span>
          </div>
          <span>
            {{ booking.borrowDate || booking.startDate }} · ₱{{ booking.totalAmount || booking.totalPrice }}
          </span>
          <span :class="['status-badge', (booking.status || 'pending').toLowerCase()]">{{ booking.status }}</span>
        </div>
        <p v-if="!bookings.length" class="empty-message">No bookings recorded yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../../../api/client'
import { initialBookings } from '../shared/rentalData'

const bookings = ref(initialBookings)
const isLoading = ref(false)

const loadBookings = async () => {
  isLoading.value = true
  try {
    const data = await api('/bookings')
    if (Array.isArray(data) && data.length > 0) {
      bookings.value = data
    }
  } catch (err) {
    console.warn('Using local booking fallback:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadBookings()
})
</script>

