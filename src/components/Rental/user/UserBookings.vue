<template>
  <div class="view-section">
    <div class="panel-card">
      <div class="header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">My Bookings</h2>
        <button class="secondary-button" style="padding: 6px 12px; font-size: 12px;" @click="loadMyBookings">Refresh</button>
      </div>
      <div class="booking-list">
        <div v-for="booking in bookings" :key="booking.id" class="booking-row">
          <div>
            <strong>{{ booking.vehicleName || booking.carName || 'Vehicle Rental' }}</strong>
            <span>{{ booking.pickupLocation || 'Main Office' }} · {{ booking.borrowDate || booking.startDate }}</span>
          </div>
          <span>₱{{ booking.totalAmount || booking.totalPrice }}</span>
          <span :class="['status-badge', (booking.status || 'pending').toLowerCase()]">{{ booking.status }}</span>
        </div>
        <p v-if="!bookings.length" class="empty-message">You have no active or previous bookings.</p>
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

const loadMyBookings = async () => {
  isLoading.value = true
  try {
    const data = await api('/bookings/my').catch(() => api('/bookings'))
    if (Array.isArray(data) && data.length > 0) {
      bookings.value = data
    }
  } catch (err) {
    console.warn('Using local booking data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMyBookings()
})
</script>

