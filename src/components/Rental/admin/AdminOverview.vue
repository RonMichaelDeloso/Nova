<template>
  <div class="view-section">
    <section class="stats-grid">
      <article v-for="stat in dashboardStats" :key="stat.label" class="stat-card">
        <span class="stat-label">{{ stat.label }}</span>
        <strong>{{ stat.value || 0 }}</strong>
        <small>{{ stat.note || 0 }}</small>
      </article>
    </section>

    <section class="main-grid">
      <div class="fleet-section">
        <div class="section-header">
          <h3>Fleet status</h3>
          <button @click="goToFleet">View all</button>
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
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminDashboardStats, initialFleetAssignments } from '../shared/rentalData'

const router = useRouter()
const dashboardStats = ref(adminDashboardStats)
const fleetAssignments = ref(initialFleetAssignments)
const expandedVehicleId = ref(null)

const toggleVehicle = (vehicleId) => {
  expandedVehicleId.value = expandedVehicleId.value === vehicleId ? null : vehicleId
}

const goToFleet = () => {
  router.push('/dashboard/admin/fleet')
}
</script>
