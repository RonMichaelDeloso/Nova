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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fleetStats, initialCars } from '../shared/rentalData'

const fleetStatsList = ref(fleetStats)
const cars = ref(initialCars)
</script>
