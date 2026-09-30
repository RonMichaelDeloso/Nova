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
          <h3>Fleet status & Recent Activity</h3>
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
              <span class="vehicle-badge" :class="vehicle.status === 'Booked' || vehicle.status === 'rented' ? 'booked' : 'available'">
                {{ vehicle.status }}
              </span>
              <div>
                <strong>{{ vehicle.model || vehicle.name }}</strong>
                <small>{{ vehicle.type || vehicle.category }}</small>
              </div>
            </div>
            <div class="driver-info">
              <strong>{{ vehicle.driver || vehicle.customer || 'Unassigned' }}</strong>
              <small>{{ vehicle.plateNumber || vehicle.phone || 'Available' }}</small>
            </div>
            <div class="trip-time">
              <strong>₱{{ vehicle.price || vehicle.pricePerDay }}/day</strong>
              <small>{{ vehicle.status === 'Available' ? 'Ready for deployment' : 'Active rental' }}</small>
            </div>

            <div v-if="expandedVehicleId === vehicle.id" class="vehicle-details">
              <div>
                <span class="detail-label">Vehicle</span>
                <strong>{{ vehicle.name || vehicle.model }}</strong>
              </div>
              <div>
                <span class="detail-label">Rate</span>
                <strong>₱{{ vehicle.price || vehicle.pricePerDay }}/day</strong>
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../../api/client'
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

const loadOverview = async () => {
  try {
    const statsData = await api('/dashboard/admin').catch(() => null)
    if (statsData) {
      dashboardStats.value = [
        { label: 'Available vehicles', value: statsData.availableCars || statsData.availableVehicles || 0, note: 'Ready to rent' },
        { label: 'Active bookings', value: statsData.bookings || 0, note: 'Confirmed schedules' },
        { label: 'Total revenue', value: `₱${(statsData.revenue || 0).toLocaleString()}`, note: 'Completed & confirmed' },
        { label: 'Maintenance', value: statsData.maintenance || 0, note: 'Under repair / check' }
      ]
    }

    const vehicles = await api('/vehicles').catch(() => api('/cars'))
    if (Array.isArray(vehicles) && vehicles.length > 0) {
      fleetAssignments.value = vehicles
    }
  } catch (err) {
    console.warn('Using local fallback for overview:', err)
  }
}

onMounted(() => {
  loadOverview()
})
</script>

