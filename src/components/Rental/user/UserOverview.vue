<template>
  <div class="view-section">
    <section class="main-grid">
      <!-- Left sidebar: Quick booking & filter -->
      <aside class="booking-panel">
        <div class="booking-card">
          <p class="eyebrow">Quick filter & dates</p>
          <h3>Plan your ride</h3>

          <div class="date-row">
            <div class="field-group">
              <label>Borrow date</label>
              <input v-model="defaultBorrowDate" type="date" />
            </div>
            <div class="field-group">
              <label>Borrow time</label>
              <input v-model="defaultBorrowTime" type="time" />
            </div>
          </div>

          <div class="date-row">
            <div class="field-group">
              <label>Return date</label>
              <input v-model="defaultReturnDate" type="date" />
            </div>
            <div class="field-group">
              <label>Return time</label>
              <input v-model="defaultReturnTime" type="time" />
            </div>
          </div>

          <div class="field-group">
            <label>Preferred brand</label>
            <select v-model="preferredBrand">
              <option v-for="brand in brandFilterList" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>

          <div class="field-group">
            <label>Vehicle Category</label>
            <select v-model="selectedCategory">
              <option value="all">All (Cars & Motorcycles)</option>
              <option value="car">Cars Only</option>
              <option value="motorcycle">Motorcycles Only</option>
            </select>
          </div>

          <button class="primary-button wide" @click="applyFilters">Apply Filter</button>
        </div>
      </aside>

      <!-- Right section: Vehicle catalog -->
      <section class="car-browser">
        <div class="brand-filter">
          <div>
            <p class="eyebrow">Available fleet</p>
            <h3>Click any vehicle to book now</h3>
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
          <article
            v-for="car in filteredCars"
            :key="car.id || car.name"
            class="car-card clickable-card"
            @click="openBookingModal(car)"
          >
            <div class="card-hover-banner">
              <span>⚡ Click to Book</span>
            </div>

            <div class="car-card-header">
              <div>
                <p class="eyebrow">{{ car.brand || 'NOVA' }}</p>
                <h3>{{ car.name }}</h3>
                <span>{{ car.category || car.type }}</span>
              </div>
              <span :class="['status-badge', (car.status || 'available').toLowerCase()]">
                {{ car.status || 'Available' }}
              </span>
            </div>

            <div class="car-illustration">
              <img v-if="car.imageUrl || car.image_url" :src="car.imageUrl || car.image_url" :alt="car.name" class="vehicle-img" />
              <span v-else class="vehicle-icon-fallback">{{ car.icon || (car.category === 'motorcycle' ? '🏍️' : '🚗') }}</span>
            </div>

            <div class="car-card-footer">
              <strong>₱{{ Number(car.price || car.pricePerDay || car.price_per_day || 0).toLocaleString() }}<small>/day</small></strong>
              <div class="car-specs">
                <span>{{ car.transmission || 'Automatic' }}</span>
                <span>{{ car.seats || 5 }} seats</span>
                <span>{{ car.fuel || 'Gasoline' }}</span>
              </div>
            </div>
          </article>
        </div>

        <div v-if="filteredCars.length === 0" class="empty-state">
          <p>No vehicles found matching your selection.</p>
        </div>
      </section>
    </section>

    <!-- ============================================== -->
    <!-- 🚗 BOOKING POP-UP MODAL                        -->
    <!-- ============================================== -->
    <div v-if="showModal && selectedVehicle" class="modal-backdrop" @click.self="closeModal">
      <div class="modal-dialog">
        <header class="modal-header">
          <div>
            <span class="modal-badge">{{ selectedVehicle.category || selectedVehicle.type || 'Vehicle' }}</span>
            <h2>Book {{ selectedVehicle.name }}</h2>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">✕</button>
        </header>

        <!-- Booking Success State -->
        <div v-if="bookingSuccess" class="booking-success-box">
          <div class="success-icon">🎉</div>
          <h3>Reservation Confirmed!</h3>
          <p>Your booking for <strong>{{ selectedVehicle.name }}</strong> has been submitted successfully.</p>
          <div class="success-details">
            <div><strong>Booking ID:</strong> #{{ createdBookingId }}</div>
            <div><strong>Schedule:</strong> {{ bookingForm.borrowDate }} ({{ bookingForm.borrowTime }}) to {{ bookingForm.returnDate }} ({{ bookingForm.returnTime }})</div>
            <div><strong>Total Amount:</strong> ₱{{ calculatedTotal.toLocaleString() }}</div>
          </div>
          <div class="success-actions">
            <button class="primary-button" @click="goToMyBookings">View My Bookings</button>
            <button class="secondary-button" @click="closeModal">Close</button>
          </div>
        </div>

        <!-- Booking Form State -->
        <form v-else class="modal-body" @submit.prevent="submitBooking">
          <!-- Vehicle Summary Card -->
          <div class="vehicle-summary-row">
            <div class="summary-thumb">
              <img v-if="selectedVehicle.imageUrl || selectedVehicle.image_url" :src="selectedVehicle.imageUrl || selectedVehicle.image_url" :alt="selectedVehicle.name" />
              <span v-else>{{ selectedVehicle.icon || '🚗' }}</span>
            </div>
            <div class="summary-info">
              <h4>{{ selectedVehicle.brand }} {{ selectedVehicle.name }}</h4>
              <p>Daily Rate: <strong>₱{{ Number(selectedVehicle.price || selectedVehicle.pricePerDay || selectedVehicle.price_per_day).toLocaleString() }}</strong> / day</p>
              <div class="summary-tags">
                <small>{{ selectedVehicle.transmission || 'Automatic' }}</small>
                <small>{{ selectedVehicle.seats || 5 }} Seats</small>
                <small>{{ selectedVehicle.fuel || 'Gasoline' }}</small>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="modal-error-alert">
            ⚠️ {{ errorMessage }}
          </div>

          <!-- Dates & Times -->
          <div class="form-grid-2">
            <div class="field-group">
              <label>Borrow Date</label>
              <input v-model="bookingForm.borrowDate" type="date" required :min="todayDateStr" />
            </div>
            <div class="field-group">
              <label>Borrow Time</label>
              <input v-model="bookingForm.borrowTime" type="time" required />
            </div>
          </div>

          <div class="form-grid-2">
            <div class="field-group">
              <label>Return Date</label>
              <input v-model="bookingForm.returnDate" type="date" required :min="bookingForm.borrowDate || todayDateStr" />
            </div>
            <div class="field-group">
              <label>Return Time</label>
              <input v-model="bookingForm.returnTime" type="time" required />
            </div>
          </div>

          <!-- Locations -->
          <div class="form-grid-2">
            <div class="field-group">
              <label>Pick-up Location</label>
              <select v-model="bookingForm.pickupLocation">
                <option value="Nova Main Hub (Pasig)">Nova Main Hub (Pasig)</option>
                <option value="NAIA Terminal 3 Airport Hub">NAIA Terminal 3 Airport Hub</option>
                <option value="BGC Central Station">BGC Central Station</option>
                <option value="Makati Ayala Center">Makati Ayala Center</option>
                <option value="Quezon City North EDSA">Quezon City North EDSA</option>
              </select>
            </div>
            <div class="field-group">
              <label>Return Location</label>
              <select v-model="bookingForm.returnLocation">
                <option value="Nova Main Hub (Pasig)">Nova Main Hub (Pasig)</option>
                <option value="NAIA Terminal 3 Airport Hub">NAIA Terminal 3 Airport Hub</option>
                <option value="BGC Central Station">BGC Central Station</option>
                <option value="Makati Ayala Center">Makati Ayala Center</option>
                <option value="Quezon City North EDSA">Quezon City North EDSA</option>
              </select>
            </div>
          </div>

          <!-- Payment Method & Notes -->
          <div class="form-grid-2">
            <div class="field-group">
              <label>Payment Method</label>
              <select v-model="bookingForm.paymentMethod">
                <option value="Cash">Cash on Pick-up</option>
                <option value="GCash">GCash / Maya E-Wallet</option>
                <option value="Credit Card">Credit / Debit Card</option>
                <option value="Bank Transfer">Bank Transfer (BDO/BPI)</option>
              </select>
            </div>
            <div class="field-group">
              <label>Special Notes (Optional)</label>
              <input v-model="bookingForm.notes" type="text" placeholder="e.g. Need child seat, late arrival" />
            </div>
          </div>

          <!-- Calculation Summary -->
          <div class="price-summary-box">
            <div class="price-row">
              <span>Rental Duration</span>
              <strong>{{ calculatedDays }} Day(s)</strong>
            </div>
            <div class="price-row">
              <span>Daily Rate</span>
              <span>₱{{ Number(selectedVehicle.price || selectedVehicle.pricePerDay || selectedVehicle.price_per_day).toLocaleString() }}</span>
            </div>
            <div class="price-divider"></div>
            <div class="price-row total-row">
              <span>Total Estimated Amount</span>
              <strong>₱{{ calculatedTotal.toLocaleString() }}</strong>
            </div>
          </div>

          <!-- Modal Footer -->
          <footer class="modal-footer">
            <button type="button" class="secondary-button" @click="closeModal" :disabled="isSubmitting">Cancel</button>
            <button type="submit" class="primary-button submit-btn" :disabled="isSubmitting || calculatedDays <= 0">
              {{ isSubmitting ? 'Processing Booking...' : `Confirm & Book (₱${calculatedTotal.toLocaleString()})` }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../../api/client'
import { brandFilters, initialCars } from '../shared/rentalData'

const router = useRouter()

// Catalog State
const cars = ref(initialCars)
const brandFilterList = ref(brandFilters)
const selectedBrand = ref('Any brand')
const preferredBrand = ref('Any brand')
const selectedCategory = ref('all')

// Date defaults
const now = new Date()
const tomorrow = new Date(now)
tomorrow.setDate(tomorrow.getDate() + 1)
const inThreeDays = new Date(now)
inThreeDays.setDate(inThreeDays.getDate() + 3)

const formatDateForInput = (d) => d.toISOString().split('T')[0]
const todayDateStr = formatDateForInput(now)

const defaultBorrowDate = ref(formatDateForInput(tomorrow))
const defaultBorrowTime = ref('09:00')
const defaultReturnDate = ref(formatDateForInput(inThreeDays))
const defaultReturnTime = ref('18:00')

// Modal State
const showModal = ref(false)
const selectedVehicle = ref(null)
const isSubmitting = ref(false)
const errorMessage = ref('')
const bookingSuccess = ref(false)
const createdBookingId = ref(null)

const bookingForm = ref({
  borrowDate: defaultBorrowDate.value,
  borrowTime: defaultBorrowTime.value,
  returnDate: defaultReturnDate.value,
  returnTime: defaultReturnTime.value,
  pickupLocation: 'Nova Main Hub (Pasig)',
  returnLocation: 'Nova Main Hub (Pasig)',
  paymentMethod: 'Cash',
  notes: ''
})

const openBookingModal = (vehicle) => {
  selectedVehicle.value = vehicle
  errorMessage.value = ''
  bookingSuccess.value = false
  bookingForm.value = {
    borrowDate: defaultBorrowDate.value,
    borrowTime: defaultBorrowTime.value,
    returnDate: defaultReturnDate.value,
    returnTime: defaultReturnTime.value,
    pickupLocation: 'Nova Main Hub (Pasig)',
    returnLocation: 'Nova Main Hub (Pasig)',
    paymentMethod: 'Cash',
    notes: ''
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedVehicle.value = null
  bookingSuccess.value = false
  errorMessage.value = ''
}

// Duration & Price calculation
const calculatedDays = computed(() => {
  if (!bookingForm.value.borrowDate || !bookingForm.value.returnDate) return 1
  const start = new Date(`${bookingForm.value.borrowDate}T${bookingForm.value.borrowTime || '09:00'}`)
  const end = new Date(`${bookingForm.value.returnDate}T${bookingForm.value.returnTime || '18:00'}`)
  const diffMs = end.getTime() - start.getTime()
  if (isNaN(diffMs) || diffMs <= 0) return 0
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return days > 0 ? days : 1
})

const calculatedTotal = computed(() => {
  if (!selectedVehicle.value) return 0
  const rate = Number(selectedVehicle.value.price || selectedVehicle.value.pricePerDay || selectedVehicle.value.price_per_day || 0)
  return rate * (calculatedDays.value || 1)
})

const submitBooking = async () => {
  if (calculatedDays.value <= 0) {
    errorMessage.value = 'Return date and time must be after borrow date and time.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      carId: Number(selectedVehicle.value.id || selectedVehicle.value.carId || 1),
      borrowDate: String(bookingForm.value.borrowDate),
      borrowTime: String(bookingForm.value.borrowTime),
      returnDate: String(bookingForm.value.returnDate),
      returnTime: String(bookingForm.value.returnTime),
      pickupLocation: bookingForm.value.pickupLocation || 'Nova Main Hub (Pasig)',
      returnLocation: bookingForm.value.returnLocation || 'Nova Main Hub (Pasig)',
      notes: bookingForm.value.notes ? String(bookingForm.value.notes) : ''
    }

    const res = await api('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    createdBookingId.value = res.id || res.insertId || Math.floor(1000 + Math.random() * 9000)
    bookingSuccess.value = true
  } catch (err) {
    errorMessage.value = err.message || 'Failed to submit booking reservation. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const goToMyBookings = () => {
  closeModal()
  router.push('/dashboard/user/bookings')
}

const applyFilters = () => {
  selectedBrand.value = preferredBrand.value
}

const loadVehicles = async () => {
  try {
    const data = await api('/vehicles').catch(() => api('/cars'))
    if (Array.isArray(data) && data.length > 0) {
      cars.value = data
      const brands = ['Any brand', ...new Set(data.map(c => c.brand).filter(Boolean))]
      brandFilterList.value = brands
    }
  } catch (err) {
    console.warn('Using local vehicle data:', err)
  }
}

onMounted(() => {
  loadVehicles()
})

const filteredCars = computed(() => {
  let list = cars.value

  if (selectedBrand.value !== 'Any brand') {
    list = list.filter((car) => car.brand === selectedBrand.value)
  }

  if (selectedCategory.value !== 'all') {
    list = list.filter((car) => (car.category || car.type || '').toLowerCase().includes(selectedCategory.value))
  }

  return list
})
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
  position: relative;
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s ease;
  overflow: hidden;
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 60, 107, 0.16);
  border-color: #003c6b;
}

.card-hover-banner {
  position: absolute;
  top: 0;
  right: 0;
  background: #003c6b;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-bottom-left-radius: 8px;
  opacity: 0.9;
  z-index: 2;
}

.vehicle-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.vehicle-icon-fallback {
  font-size: 42px;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #777;
}

/* ========================================= */
/* POPUP MODAL STYLES                       */
/* ========================================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 15, 30, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 640px;
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  padding: 18px 24px;
  background: #07162f;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-badge {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 6px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Vehicle Summary */
.vehicle-summary-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f4f7fb;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.summary-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  font-size: 28px;
}

.summary-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-info h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #0f172a;
}

.summary-info p {
  margin: 0 0 6px;
  font-size: 13px;
  color: #475569;
}

.summary-tags {
  display: flex;
  gap: 6px;
}

.summary-tags small {
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  border: 1px solid #cbd5e1;
  color: #334155;
}

/* Form Grids */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.field-group label {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.field-group input,
.field-group select {
  height: 40px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: #ffffff;
  transition: border-color 0.2s;
}

.field-group input:focus,
.field-group select:focus {
  border-color: #003c6b;
  box-shadow: 0 0 0 2px rgba(0, 60, 107, 0.1);
}

/* Price Calculation Box */
.price-summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
}

.price-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

.total-row {
  font-size: 15px;
  font-weight: 700;
  color: #07162f;
  margin-bottom: 0;
}

.total-row strong {
  color: #003c6b;
  font-size: 18px;
}

/* Modal Error */
.modal-error-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.submit-btn {
  background: #003c6b;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #002747;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success View */
.booking-success-box {
  padding: 32px 24px;
  text-align: center;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.booking-success-box h3 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #07162f;
}

.booking-success-box p {
  color: #64748b;
  margin: 0 0 20px;
  font-size: 14px;
}

.success-details {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  text-align: left;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 600px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>


