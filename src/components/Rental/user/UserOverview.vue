<template>
  <div class="view-section">
    <section class="main-grid">
      <aside class="booking-panel">
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
            <select v-model="preferredBrand">
              <option v-for="brand in brandFilterList" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>

          <button class="primary-button wide" @click="checkAvailability">Check availability</button>
        </div>
      </aside>

      <section class="car-browser">
        <div class="brand-filter">
          <div>
            <p class="eyebrow">Browse by brand</p>
            <h3>Choose your preferred brand</h3>
          </div>
          <div class="brand-filter-options">
            <button
              v-for="brand in brandFilterList"
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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { brandFilters, initialCars } from '../shared/rentalData'

const cars = ref(initialCars)
const brandFilterList = brandFilters
const selectedBrand = ref('Any brand')
const preferredBrand = ref('Any brand')

const checkAvailability = () => {
  selectedBrand.value = preferredBrand.value
}

const filteredCars = computed(() => {
  if (selectedBrand.value === 'Any brand') {
    return cars.value
  }
  return cars.value.filter((car) => car.brand === selectedBrand.value)
})
</script>
