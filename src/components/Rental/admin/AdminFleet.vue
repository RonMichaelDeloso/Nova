<template>
  <div class="view-section">
    <div class="panel-card">
      <h2>Fleet overview</h2>
      <div class="data-grid">
        <div v-for="stat in fleetStatsList" :key="stat.label" class="data-card">
          <span>{{ stat.label }}</span>
          <strong>{{ stat.value || 0 }}</strong>
          <small>{{ stat.note || 0 }}</small>
        </div>
      </div>
    </div>

    <div class="panel-card">
      <div class="header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0;">Vehicle inventory</h3>
        <button class="secondary-button" style="padding: 6px 12px; font-size: 12px;" @click="loadFleet">Refresh</button>
      </div>
      <div class="booking-list">
        <div v-for="car in cars" :key="car.id || car.name" class="booking-row">
          <div>
            <strong>{{ car.name }}</strong>
            <span>{{ car.brand }} · {{ car.category || car.type }}</span>
          </div>
          <span :class="['status-badge', (car.status || 'Available').toLowerCase()]">{{ car.status }}</span>
          <strong>₱{{ car.price || car.pricePerDay || car.price_per_day }}/day</strong>
        </div>
        <p v-if="!cars.length" class="empty-message">No vehicles found in database.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../../../api/client'
import { fleetStats, initialCars } from '../shared/rentalData'

const fleetStatsList = ref(fleetStats)
const cars = ref(initialCars)
const isLoading = ref(false)

const loadFleet = async () => {
  isLoading.value = true
  try {
    const data = await api('/vehicles').catch(() => api('/cars'))
    if (Array.isArray(data) && data.length > 0) {
      cars.value = data
      
      const availableCount = data.filter(c => (c.status || '').toLowerCase() === 'available').length
      const rentedCount = data.filter(c => (c.status || '').toLowerCase() === 'rented' || (c.status || '').toLowerCase() === 'booked').length
      const maintenanceCount = data.filter(c => (c.status || '').toLowerCase() === 'maintenance').length

      fleetStatsList.value = [
        { label: 'Total Fleet', value: data.length, note: 'Registered vehicles' },
        { label: 'Available', value: availableCount, note: 'Ready for booking' },
        { label: 'Rented / Booked', value: rentedCount, note: 'On the road' },
        { label: 'Maintenance', value: maintenanceCount, note: 'In service' }
      ]
    }
  } catch (err) {
    console.warn('Using local vehicle data fallback:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFleet()
})
</script>

