<template>
  <div class="view-section">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { initialBookings } from '../shared/rentalData'

const bookings = ref(initialBookings)
</script>
