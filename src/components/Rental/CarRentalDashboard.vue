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
          <span class="nav-icon-wrap">
            <svg v-if="item.key === 'dashboard'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <svg v-else-if="item.key === 'fleet'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <svg v-else-if="item.key === 'bookings'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <svg v-else-if="item.key === 'renter-information'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <svg v-else-if="item.key === 'nearby'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <svg v-else-if="item.key === 'messages'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <span class="nav-text-label">{{ item.label }}</span>
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
            <svg class="search-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search vehicle" />
          </div>
          <button v-if="!isAdmin" class="primary-button new-booking-btn" @click="openBookingModal()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Booking</span>
          </button>
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
              <h3>Fleet Status</h3>
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
              <p class="eyebrow">Quick Booking</p>
              <h3>Reserve Your Ride</h3>

              <div class="streamlined-schedule-box">
                <div class="schedule-pair">
                  <div class="field-group">
                    <label for="overview-pickup-date">Borrow Date</label>
                    <input id="overview-pickup-date" v-model="availabilityForm.pickupDate" type="date" :min="today" required />
                  </div>
                  <div class="field-group">
                    <label for="overview-pickup-time">Borrow Time</label>
                    <input id="overview-pickup-time" v-model="availabilityForm.pickupTime" type="time" required />
                  </div>
                </div>

                <div class="schedule-pair">
                  <div class="field-group">
                    <label for="overview-return-date">Return Date</label>
                    <input id="overview-return-date" v-model="availabilityForm.dropoffDate" type="date" :min="availabilityForm.pickupDate || today" required />
                  </div>
                  <div class="field-group">
                    <label for="overview-return-time">Return Time</label>
                    <input id="overview-return-time" v-model="availabilityForm.dropoffTime" type="time" required />
                  </div>
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

              <button class="primary-button wide" type="button" @click="checkAvailability">Check Availability</button>
              <p v-if="availabilityError" class="form-error" role="alert">{{ availabilityError }}</p>
              <div v-if="availabilityChecked" class="availability-results" aria-live="polite">
                <h4>{{ availableVehicles.length }} vehicle{{ availableVehicles.length === 1 ? '' : 's' }} available</h4>
                <p class="form-note">For {{ availabilityForm.pickupDate }} {{ availabilityForm.pickupTime }} to {{ availabilityForm.dropoffDate }} {{ availabilityForm.dropoffTime }}</p>
                <div v-if="availableVehicles.length" class="availability-car-list">
                  <div v-for="car in availableVehicles" :key="car.name" class="availability-car-row">
                    <span class="availability-car-badge">{{ car.brand }}</span>
                    <div class="availability-car-info"><strong>{{ car.name }}</strong><small>{{ car.brand }} · {{ car.type }} · {{ car.seats }} seats</small></div>
                    <strong>₱{{ car.price }}/day</strong>
                    <button type="button" class="primary-button small-btn" @click="openBookingModal(car)">Book Now</button>
                  </div>
                </div>
                <p v-else class="empty-message">No matching vehicles are available for those dates. Try another date or brand.</p>
              </div>
            </div>

          </aside>

          <section v-if="!isAdmin" class="car-browser">
            <div class="brand-filter">
              <div>
                <p class="eyebrow">Browse by Brand</p>
                <h3>Choose Your Preferred Brand</h3>
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
                  <p class="eyebrow">Vehicle</p>
                  <h3>{{ car.name }}</h3>
                  <span>{{ car.brand }} · {{ car.type }}</span>
                </div>
                <span :class="['status-badge', isCarAvailable(car) ? 'confirmed' : 'pending']">
                  {{ isCarAvailable(car) ? 'Available' : 'Booked' }}
                </span>
              </div>
              <div class="car-illustration car-badge-pill">{{ car.type }} · {{ car.seats }} Seats</div>
              <div class="car-card-footer">
                <strong>₱{{ car.price }}<small>/day</small></strong>
                <div class="car-specs">
                  <span>{{ car.transmission }}</span>
                  <span>{{ car.seats }} seats</span>
                  <span>{{ car.fuel }}</span>
                </div>
              </div>
              <button
                v-if="isCarAvailable(car)"
                type="button"
                class="primary-button card-book-btn"
                @click="openBookingModal(car)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>Book Now</span>
              </button>
              <button
                v-else
                type="button"
                class="secondary-button card-book-btn booked-btn"
                disabled
              >
                <span>Already Booked</span>
              </button>
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
          <p class="eyebrow">Plan Your Trip</p><h2>Create a Rental Booking</h2>
          <p class="panel-description">Enter your renter details first, then choose your vehicle and rental schedule.</p>
          <form class="rental-form" @submit.prevent="createBooking">
            <div class="renter-info-section">
              <h3>Renter Information</h3>
              <p>These details help the rental team contact you and verify your booking.</p>
            </div>
            <div class="form-field"><label for="renter-full-name">Full name</label><input id="renter-full-name" v-model.trim="bookingForm.renterName" autocomplete="name" required placeholder="Enter your full legal name" /></div>
            <div class="form-field"><label for="renter-phone">Contact number</label><input id="renter-phone" v-model.trim="bookingForm.phone" type="tel" autocomplete="tel" required placeholder="e.g. 09XX XXX XXXX" /></div>
            <div class="form-field"><label for="renter-email">Email address</label><input id="renter-email" v-model.trim="bookingForm.email" type="email" autocomplete="email" required placeholder="you@example.com" /></div>
            <div class="form-field"><label for="renter-address">Home address</label><input id="renter-address" v-model.trim="bookingForm.address" autocomplete="street-address" required placeholder="House number, street, city" /></div>
            <div class="form-field"><label for="renter-license">Driver's license number</label><input id="renter-license" v-model.trim="bookingForm.licenseNumber" required placeholder="Enter your driver's license number" /></div>
            <div class="form-field"><label for="renter-license-expiry">License expiry date</label><input id="renter-license-expiry" v-model="bookingForm.licenseExpiry" type="date" required /></div>
            <div class="renter-info-section">
              <h3>Rental Details</h3>
              <p>Choose your rental dates, times, and preferred vehicle.</p>
            </div>
            <div class="form-schedule-grid">
              <div class="form-field">
                <label for="pickup-date">Pickup Date</label>
                <input id="pickup-date" v-model="bookingForm.pickupDate" type="date" :min="today" required />
              </div>
              <div class="form-field">
                <label for="pickup-time">Pickup Time</label>
                <input id="pickup-time" v-model="bookingForm.pickupTime" type="time" required />
              </div>
            </div>
            <div class="form-schedule-grid">
              <div class="form-field">
                <label for="dropoff-date">Drop-off Date</label>
                <input id="dropoff-date" v-model="bookingForm.dropoffDate" type="date" :min="bookingForm.pickupDate || today" required />
              </div>
              <div class="form-field">
                <label for="dropoff-time">Drop-off Time</label>
                <input id="dropoff-time" v-model="bookingForm.dropoffTime" type="time" required />
              </div>
            </div>
            <div class="form-field"><label for="rental-brand">Preferred Vehicle</label><select id="rental-brand" v-model="bookingForm.brand"><option>Any brand</option><option>Mazda</option><option>Toyota</option><option>Suzuki</option><option>Honda</option><option>Nissan</option></select></div>
            <div class="form-field"><label for="rental-notes">Trip Notes (optional)</label><input id="rental-notes" v-model.trim="bookingForm.notes" placeholder="Extra details for your booking" /></div>
            <p v-if="bookingError" class="form-error">{{ bookingError }}</p><button type="submit" class="primary-button">Submit Booking Request</button>
          </form>
        </div>
        <div class="panel-card"><h2>{{ isAdmin ? 'Booking Requests' : 'Your Bookings' }}</h2>
          <div class="booking-list">
            <div v-for="booking in bookings" :key="booking.id" class="booking-row">
              <div>
                <strong>
                  {{ booking.customer }} · {{ booking.brand }}
                  <span v-if="booking.carName">({{ booking.carName }})</span>
                  <small v-if="booking.bookingRef" class="booking-ref-tag">#{{ booking.bookingRef }}</small>
                </strong>
                <span v-if="booking.pickup && booking.dropoff">{{ booking.pickup }} → {{ booking.dropoff }}</span>
                <span v-if="booking.totalPrice" class="booking-price-tag">₱{{ booking.totalPrice }} ({{ booking.durationDays || 1 }} day{{ (booking.durationDays || 1) > 1 ? 's' : '' }})</span>
                <span>{{ booking.notes || 'No extra notes' }}</span>
              </div>
              <span>Pickup {{ booking.pickupDate }} {{ booking.pickupTime }} · Drop-off {{ booking.dropoffDate }} {{ booking.dropoffTime }}</span>
              <span :class="['status-badge', booking.status.toLowerCase()]">{{ booking.status }}</span>
            </div><p v-if="!bookings.length" class="empty-message">No bookings yet. Create your first rental request above.</p>
          </div>
        </div>
      </section>
      <section v-else-if="activeView === 'renter-information'" class="view-section">
        <div class="panel-card">
          <p class="eyebrow">Customer Details</p>
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
                <div class="renter-detail"><span>Contact Number</span><strong>{{ renter.phone || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>Email Address</span><strong>{{ renter.email || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>Home Address</span><strong>{{ renter.address || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>Driver's License</span><strong>{{ renter.licenseNumber || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>License Expiry</span><strong>{{ renter.licenseExpiry || 'Not provided' }}</strong></div>
                <div class="renter-detail"><span>Preferred Vehicle</span><strong>{{ renter.brand || 'Any brand' }}</strong></div>
              </div>
              <div class="renter-rental-summary">
                <h4>Rental Details</h4>
                <div class="renter-profile-grid">
                  <div v-if="renter.pickup" class="renter-detail"><span>Pickup Location</span><strong>{{ renter.pickup }}</strong></div>
                  <div v-if="renter.dropoff" class="renter-detail"><span>Drop-off Location</span><strong>{{ renter.dropoff }}</strong></div>
                  <div class="renter-detail"><span>Pickup Schedule</span><strong>{{ renter.pickupDate }} · {{ renter.pickupTime }}</strong></div>
                  <div class="renter-detail"><span>Return Schedule</span><strong>{{ renter.dropoffDate }} · {{ renter.dropoffTime }}</strong></div>
                </div>
              </div>
            </article>
            <p v-if="!renterInformation.length" class="empty-message">No renter profiles yet. Complete a booking and each renter's information will appear here as a separate profile card.</p>
          </div>
        </div>
      </section>
      <section v-else-if="activeView === 'nearby'" class="view-section">
        <div class="panel-card"><p class="eyebrow">Explore Around You</p><h2>Nearby Places & Map</h2>
          <p class="panel-description">Search for an address or place to view it on OpenStreetMap. Allow location access to use your current location.</p>
          <div class="location-search"><input v-model.trim="mapSearch" aria-label="Search map location" placeholder="Search a place or address..." @keyup.enter="openMapSearch" /><button class="primary-button" @click="openMapSearch">Search Map</button><button class="secondary-button" @click="useCurrentLocation">Use My Location</button></div>
          <p v-if="locationMessage" class="location-message">{{ locationMessage }}</p>
          <div class="map-frame"><iframe title="OpenStreetMap location map" :src="mapEmbedUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
          <a class="map-link" :href="mapSearchUrl" target="_blank" rel="noopener noreferrer">Open full map in OpenStreetMap ↗</a>
        </div>
        <div class="panel-card"><h2>Popular Places to Explore</h2><p class="panel-description">Example destinations. Select one to view its map; verify the address and travel details before leaving.</p>
          <div class="places-grid"><button v-for="place in nearbyPlaces" :key="place.name" class="place-card" @click="selectNearbyPlace(place)"><span class="place-marker-dot"></span><strong>{{ place.name }}</strong><span>{{ place.description }}</span><small>View on map ↗</small></button></div>
        </div>
      </section>

      <section v-else-if="activeView === 'messages'" class="view-section">
        <div class="panel-card messages-panel">
          <div class="messages-heading">
            <div>
              <p class="eyebrow">Communication</p>
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
                  <button class="primary-button" type="submit" :disabled="!messageDraft.trim()">Send Message</button>
                </form>
              </template>
              <template v-else>
                <div class="new-message-placeholder">
                  <template v-if="isAdmin">
                    <span class="placeholder-icon-empty"></span>
                    <h3>No customer conversations yet</h3>
                    <p>When a renter sends a message, their conversation will appear on the left. Open it to reply.</p>
                  </template>
                  <template v-else>
                    <span class="placeholder-icon-empty"></span>
                    <h3>Start a conversation</h3>
                    <p>Send a message to the rental team. Include your booking reference if you already made a reservation.</p>
                    <form class="new-message-form" @submit.prevent="startConversation">
                      <label for="message-subject">Subject</label>
                      <input id="message-subject" v-model.trim="messageSubject" maxlength="100" placeholder="e.g. Question about my booking" required />
                      <label for="first-message">Message</label>
                      <textarea id="first-message" v-model.trim="messageDraft" rows="4" maxlength="2000" placeholder="How can we help you?" required></textarea>
                      <button class="primary-button" type="submit" :disabled="!messageSubject.trim() || !messageDraft.trim()">Send to Rental Support</button>
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

    <!-- Booking & Confirmation Modal -->
    <div
      v-if="isBookingModalOpen"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      @click.self="closeBookingModal"
    >
      <div class="modal-dialog">
        <!-- Modal Header -->
        <header class="modal-header">
          <div>
            <p class="modal-eyebrow">
              <span v-if="bookingModalStep === 1">Step 1 of 2: Reservation Details</span>
              <span v-else-if="bookingModalStep === 2">Step 2 of 2: Review &amp; Confirm</span>
              <span v-else>Reservation Complete</span>
            </p>
            <h2 id="booking-modal-title">
              {{
                bookingModalStep === 1
                  ? 'Reserve Your Vehicle'
                  : bookingModalStep === 2
                  ? 'Confirm Your Booking'
                  : 'Booking Confirmed!'
              }}
            </h2>
          </div>
          <button class="modal-close-btn" type="button" aria-label="Close modal" @click="closeBookingModal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <!-- Stepper Progress Bar -->
        <div class="modal-steps-indicator">
          <div class="step-item" :class="{ active: bookingModalStep === 1, completed: bookingModalStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-text">Details</span>
          </div>
          <div class="step-line" :class="{ filled: bookingModalStep >= 2 }"></div>
          <div class="step-item" :class="{ active: bookingModalStep === 2, completed: bookingModalStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-text">Confirmation</span>
          </div>
          <div class="step-line" :class="{ filled: bookingModalStep === 3 }"></div>
          <div class="step-item" :class="{ active: bookingModalStep === 3 }">
            <span class="step-number">✓</span>
            <span class="step-text">Confirmed</span>
          </div>
        </div>

        <!-- Modal Body: Step 1 (Booking Form) -->
        <div v-if="bookingModalStep === 1" class="modal-body">
          <!-- Selected Vehicle Info Banner -->
          <div class="modal-vehicle-banner">
            <div class="modal-vehicle-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <div class="modal-vehicle-info">
              <div class="modal-vehicle-title">
                <h3>{{ modalCar?.name }}</h3>
                <span class="modal-badge">{{ modalCar?.brand }} · {{ modalCar?.type }}</span>
              </div>
              <div class="modal-vehicle-tags">
                <span>{{ modalCar?.seats }} Seats</span>
                <span>{{ modalCar?.transmission }}</span>
                <span>{{ modalCar?.fuel }}</span>
              </div>
            </div>
            <div class="modal-vehicle-rate">
              <span class="rate-label">Daily Rate</span>
              <strong>₱{{ modalCar?.price }}<small>/day</small></strong>
            </div>
          </div>

          <!-- Switch Car Selector -->
          <div class="form-field full-width">
            <label for="modal-car-select">Select Vehicle</label>
            <select id="modal-car-select" v-model="selectedModalCarName">
              <option v-for="c in cars" :key="c.name" :value="c.name">
                {{ c.name }} ({{ c.brand }} · {{ c.type }}) — ₱{{ c.price }}/day
              </option>
            </select>
          </div>

          <!-- Section: Schedule -->
          <div class="modal-section-title">
            <h4>Rental Schedule</h4>
            <span class="modal-section-hint">{{ modalRentalDays }} day{{ modalRentalDays > 1 ? 's' : '' }} duration</span>
          </div>

          <div class="form-schedule-grid">
            <div class="form-field">
              <label for="modal-pickup-date">Pickup Date</label>
              <input id="modal-pickup-date" v-model="modalForm.pickupDate" type="date" :min="today" required />
            </div>
            <div class="form-field">
              <label for="modal-pickup-time">Pickup Time</label>
              <input id="modal-pickup-time" v-model="modalForm.pickupTime" type="time" required />
            </div>
          </div>

          <div class="form-schedule-grid">
            <div class="form-field">
              <label for="modal-dropoff-date">Return Date</label>
              <input id="modal-dropoff-date" v-model="modalForm.dropoffDate" type="date" :min="modalForm.pickupDate || today" required />
            </div>
            <div class="form-field">
              <label for="modal-dropoff-time">Return Time</label>
              <input id="modal-dropoff-time" v-model="modalForm.dropoffTime" type="time" required />
            </div>
          </div>

          <!-- Section: Renter Information -->
          <div class="modal-section-title">
            <h4>Renter Information</h4>
            <span class="modal-section-hint">Required for driver verification</span>
          </div>

          <div class="form-schedule-grid">
            <div class="form-field">
              <label for="modal-renter-name">Full Name</label>
              <input id="modal-renter-name" v-model.trim="modalForm.renterName" placeholder="Your full name" required />
            </div>
            <div class="form-field">
              <label for="modal-renter-phone">Contact Number</label>
              <input id="modal-renter-phone" v-model.trim="modalForm.phone" type="tel" placeholder="09XX XXX XXXX" required />
            </div>
          </div>

          <div class="form-schedule-grid">
            <div class="form-field">
              <label for="modal-renter-email">Email Address</label>
              <input id="modal-renter-email" v-model.trim="modalForm.email" type="email" placeholder="you@example.com" required />
            </div>
            <div class="form-field">
              <label for="modal-renter-address">Home Address</label>
              <input id="modal-renter-address" v-model.trim="modalForm.address" placeholder="Street, City" required />
            </div>
          </div>

          <div class="form-schedule-grid">
            <div class="form-field">
              <label for="modal-license-number">Driver's License Number</label>
              <input id="modal-license-number" v-model.trim="modalForm.licenseNumber" placeholder="e.g. N01-12-345678" required />
            </div>
            <div class="form-field">
              <label for="modal-license-expiry">License Expiry Date</label>
              <input id="modal-license-expiry" v-model="modalForm.licenseExpiry" type="date" :min="today" required />
            </div>
          </div>

          <div class="form-field full-width">
            <label for="modal-notes">Trip Notes (optional)</label>
            <input id="modal-notes" v-model.trim="modalForm.notes" placeholder="e.g. Flight arrival time, requests" />
          </div>

          <!-- Price Calculation Box -->
          <div class="modal-price-box">
            <div class="price-row">
              <span>Rental Rate ({{ modalRentalDays }} day{{ modalRentalDays > 1 ? 's' : '' }} × ₱{{ modalCar?.price }})</span>
              <strong>₱{{ modalTotalPrice }}</strong>
            </div>
            <div class="price-row total-highlight">
              <span>Estimated Total Due</span>
              <strong class="total-amount">₱{{ modalTotalPrice }}</strong>
            </div>
          </div>

          <p v-if="modalError" class="modal-error-alert" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{{ modalError }}</span>
          </p>
        </div>

        <!-- Modal Body: Step 2 (Confirmation Review) -->
        <div v-else-if="bookingModalStep === 2" class="modal-body confirmation-view">
          <div class="confirmation-notice">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <div>
              <strong>Please review your booking details before confirming.</strong>
              <small>Ensure your schedule, vehicle selection, and contact details are accurate.</small>
            </div>
          </div>

          <!-- Receipt Summary Card -->
          <div class="confirmation-card">
            <!-- Vehicle Summary -->
            <div class="confirm-block">
              <span class="confirm-label">Selected Vehicle</span>
              <div class="confirm-car-row">
                <div>
                  <h4>{{ modalCar?.name }}</h4>
                  <p>{{ modalCar?.brand }} · {{ modalCar?.type }} · {{ modalCar?.seats }} Seats · {{ modalCar?.transmission }}</p>
                </div>
                <strong class="confirm-car-rate">₱{{ modalCar?.price }} / day</strong>
              </div>
            </div>

            <div class="confirm-divider"></div>

            <!-- Schedule & Locations -->
            <div class="confirm-grid">
              <div class="confirm-item">
                <span class="confirm-label">Borrow Schedule</span>
                <strong>{{ modalForm.pickupDate }} · {{ modalForm.pickupTime }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Return Schedule</span>
                <strong>{{ modalForm.dropoffDate }} · {{ modalForm.dropoffTime }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Rental Duration</span>
                <strong>{{ modalRentalDays }} Day{{ modalRentalDays > 1 ? 's' : '' }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Payment Method</span>
                <strong>Pay on Pickup (Cash / Card / GCash)</strong>
              </div>
            </div>

            <div class="confirm-divider"></div>

            <!-- Renter Info -->
            <div class="confirm-grid">
              <div class="confirm-item">
                <span class="confirm-label">Renter Name</span>
                <strong>{{ modalForm.renterName }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Contact Number</span>
                <strong>{{ modalForm.phone }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Email Address</span>
                <strong>{{ modalForm.email }}</strong>
              </div>
              <div class="confirm-item">
                <span class="confirm-label">Driver's License</span>
                <strong>{{ modalForm.licenseNumber }} (Exp: {{ modalForm.licenseExpiry }})</strong>
              </div>
              <div class="confirm-item full-span">
                <span class="confirm-label">Home Address</span>
                <strong>{{ modalForm.address }}</strong>
              </div>
              <div v-if="modalForm.notes" class="confirm-item full-span">
                <span class="confirm-label">Trip Notes</span>
                <strong>{{ modalForm.notes }}</strong>
              </div>
            </div>

            <div class="confirm-divider"></div>

            <!-- Pricing Breakdown -->
            <div class="confirm-price-summary">
              <div class="confirm-price-row">
                <span>Daily Rate</span>
                <span>₱{{ modalCar?.price }} × {{ modalRentalDays }} day{{ modalRentalDays > 1 ? 's' : '' }}</span>
              </div>
              <div class="confirm-price-row total">
                <span>Total Amount to Pay</span>
                <strong>₱{{ modalTotalPrice }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Body: Step 3 (Confirmed Success Screen) -->
        <div v-else-if="bookingModalStep === 3" class="modal-body success-view">
          <div class="success-icon-wrap">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3>Booking Successfully Confirmed!</h3>
          <p class="success-subtitle">
            Your reservation reference number is
            <span class="booking-ref-badge">#{{ confirmedBookingId }}</span>
          </p>

          <div class="success-card">
            <div class="success-summary-row">
              <span>Reserved Vehicle:</span>
              <strong>{{ confirmedBookingSummary?.carName }} ({{ confirmedBookingSummary?.brand }})</strong>
            </div>
            <div class="success-summary-row">
              <span>Rental Period:</span>
              <strong>{{ confirmedBookingSummary?.pickupDate }} {{ confirmedBookingSummary?.pickupTime }} → {{ confirmedBookingSummary?.dropoffDate }} {{ confirmedBookingSummary?.dropoffTime }}</strong>
            </div>
            <div class="success-summary-row">
              <span>Total Price:</span>
              <strong class="success-price">₱{{ confirmedBookingSummary?.totalPrice }} ({{ confirmedBookingSummary?.days }} days)</strong>
            </div>
            <div class="success-summary-row">
              <span>Renter:</span>
              <strong>{{ confirmedBookingSummary?.renterName }} ({{ confirmedBookingSummary?.phone }})</strong>
            </div>
          </div>

          <div class="success-instructions">
            <p>💡 <strong>Pickup Tip:</strong> Please present a valid government-issued ID and your physical driver's license when claiming the vehicle key.</p>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <footer class="modal-footer">
          <template v-if="bookingModalStep === 1">
            <button class="secondary-button" type="button" @click="closeBookingModal">Cancel</button>
            <button class="primary-button" type="button" @click="goToConfirmation">
              Proceed to Confirmation →
            </button>
          </template>
          <template v-else-if="bookingModalStep === 2">
            <button class="secondary-button" type="button" @click="bookingModalStep = 1">
              ← Edit Details
            </button>
            <button class="primary-button confirm-action-btn" type="button" @click="confirmModalBooking">
              Confirm Booking
            </button>
          </template>
          <template v-else-if="bookingModalStep === 3">
            <button class="secondary-button" type="button" @click="closeBookingModal">
              Stay in Overview
            </button>
            <button class="secondary-button" type="button" @click="viewRenterInfoFromModal">
              View Renter Profile
            </button>
            <button class="primary-button" type="button" @click="viewBookingsFromModal">
              View My Bookings
            </button>
          </template>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
  { key: 'dashboard', label: 'Overview' },
  ...(isAdmin.value ? [{ key: 'fleet', label: 'Fleet' }] : []),
  { key: 'bookings', label: 'Bookings' },
  ...(!isAdmin.value ? [{ key: 'renter-information', label: 'Renter Information' }] : []),
  ...(!isAdmin.value ? [{ key: 'nearby', label: 'Nearby Places' }] : []),
  { key: 'messages', label: 'Messages' },
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

const cars = [
  { name: 'Mazda 3', brand: 'Mazda', type: 'Compact Sedan', price: 85, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '', tint: 'blue' },
  { name: 'Toyota Camry', brand: 'Toyota', type: 'Comfort Sedan', price: 95, transmission: 'Automatic', seats: 5, fuel: 'Hybrid', status: 'Available', icon: '', tint: 'navy' },
  { name: 'Suzuki Ertiga', brand: 'Suzuki', type: 'Family MPV', price: 80, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '', tint: 'slate' },
  { name: 'Honda Civic', brand: 'Honda', type: 'Sport Sedan', price: 105, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '', tint: 'sky' },
  { name: 'Nissan X-Trail', brand: 'Nissan', type: 'Luxury SUV', price: 125, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '', tint: 'blue' },
]

const bookingStorageKey = 'motor-car-rental-bookings'
const renterStorageKey = 'motor-car-rental-renters'

const loadStoredBookings = () => {
  try {
    const raw = localStorage.getItem(bookingStorageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const loadStoredRenters = () => {
  try {
    const raw = localStorage.getItem(renterStorageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const bookings = ref(loadStoredBookings())
const renterInformation = ref(loadStoredRenters())

const persistBookings = () => {
  try {
    localStorage.setItem(bookingStorageKey, JSON.stringify(bookings.value))
  } catch (e) {
    console.warn('Failed to save bookings in localStorage', e)
  }
}

const persistRenters = () => {
  try {
    localStorage.setItem(renterStorageKey, JSON.stringify(renterInformation.value))
  } catch (e) {
    console.warn('Failed to save renters in localStorage', e)
  }
}

watch(bookings, persistBookings, { deep: true })
watch(renterInformation, persistRenters, { deep: true })

const availabilityForm = ref({ pickupDate: today, pickupTime: '09:00', dropoffDate: tomorrow, dropoffTime: '18:00', brand: 'Any brand' })
const availabilityChecked = ref(false)
const availabilityError = ref('')
const bookingForm = ref({ renterName: '', phone: '', email: '', address: '', licenseNumber: '', licenseExpiry: '', pickup: '', dropoff: '', pickupCustom: '', dropoffCustom: '', pickupDate: today, pickupTime: '09:00', dropoffDate: today, dropoffTime: '18:00', brand: 'Any brand', notes: '' })

watch(() => availabilityForm.value.pickupDate, (newPickup) => {
  if (newPickup && availabilityForm.value.dropoffDate < newPickup) {
    availabilityForm.value.dropoffDate = newPickup
  }
})

watch(() => bookingForm.value.pickupDate, (newPickup) => {
  if (newPickup && bookingForm.value.dropoffDate < newPickup) {
    bookingForm.value.dropoffDate = newPickup
  }
})
const bookingError = ref('')

const mapSearch = ref('Cagayan de Oro, Philippines')
const mapQuery = ref('Cagayan de Oro, Philippines')
const locationMessage = ref('')
const mapEmbedUrl = computed(() => `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`)
const mapSearchUrl = computed(() => `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery.value)}`)
const nearbyPlaces = [
  { name: 'Centrio Mall', icon: '', description: 'Shopping and dining', query: 'Centrio Mall, Cagayan de Oro, Philippines' },
  { name: 'Limketkai Center', icon: '', description: 'Shopping and entertainment', query: 'Limketkai Center, Cagayan de Oro, Philippines' },
  { name: 'Gaston Park', icon: '', description: 'City park and open space', query: 'Gaston Park, Cagayan de Oro, Philippines' },
  { name: 'Museo de Oro', icon: '', description: 'Local history and culture', query: 'Museo de Oro, Cagayan de Oro, Philippines' },
  { name: 'Macabalan Port', icon: '', description: 'Port and ferry area', query: 'Macabalan Port, Cagayan de Oro, Philippines' },
  { name: 'SM CDO Downtown Premier', icon: '', description: 'Shopping and restaurants', query: 'SM CDO Downtown Premier, Cagayan de Oro, Philippines' },
]
const bookingFormDefaults = () => ({ renterName: '', phone: '', email: '', address: '', licenseNumber: '', licenseExpiry: '', pickupDate: today, pickupTime: '09:00', dropoffDate: today, dropoffTime: '18:00', brand: 'Any brand', notes: '' })
const createBooking = () => {
  bookingError.value = ''

  if (bookingForm.value.licenseExpiry && bookingForm.value.licenseExpiry < today) {
    bookingError.value = 'Your driver’s license must not be expired.'
    return
  }
  if (bookingForm.value.dropoffDate < bookingForm.value.pickupDate || (bookingForm.value.dropoffDate === bookingForm.value.pickupDate && bookingForm.value.dropoffTime <= bookingForm.value.pickupTime)) {
    bookingError.value = 'Drop-off must be after the pickup date and time.'
    return
  }
  const bookingId = Date.now()
  const refCode = `BK-${String(bookingId).slice(-6)}`
  const renterRecord = {
    id: bookingId,
    bookingId,
    bookingRef: refCode,
    renterName: bookingForm.value.renterName,
    phone: bookingForm.value.phone,
    email: bookingForm.value.email,
    address: bookingForm.value.address,
    licenseNumber: bookingForm.value.licenseNumber,
    licenseExpiry: bookingForm.value.licenseExpiry,
    brand: bookingForm.value.brand,
    pickupDate: bookingForm.value.pickupDate,
    pickupTime: bookingForm.value.pickupTime,
    dropoffDate: bookingForm.value.dropoffDate,
    dropoffTime: bookingForm.value.dropoffTime,
  }
  renterInformation.value.unshift(renterRecord)
  bookings.value.unshift({
    id: bookingId,
    bookingRef: refCode,
    customer: bookingForm.value.renterName,
    renterName: bookingForm.value.renterName,
    phone: bookingForm.value.phone,
    email: bookingForm.value.email,
    address: bookingForm.value.address,
    licenseNumber: bookingForm.value.licenseNumber,
    licenseExpiry: bookingForm.value.licenseExpiry,
    pickupDate: bookingForm.value.pickupDate,
    pickupTime: bookingForm.value.pickupTime,
    dropoffDate: bookingForm.value.dropoffDate,
    dropoffTime: bookingForm.value.dropoffTime,
    brand: bookingForm.value.brand,
    notes: bookingForm.value.notes,
    status: 'Pending',
    createdAt: new Date().toISOString()
  })
  persistBookings()
  persistRenters()
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
    locationMessage.value = 'Current coordinates loaded. Open the full map for nearby results.'
  }, () => { locationMessage.value = 'Location access was not available. You can search for a place manually.' }, { enableHighAccuracy: true, timeout: 10000 })
}

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

// Calculate duration in days between pickup and dropoff
const calculateRentalDays = (startDate, startTime, endDate, endTime) => {
  if (!startDate || !endDate) return 1
  const start = new Date(`${startDate}T${startTime || '00:00'}`)
  const end = new Date(`${endDate}T${endTime || '00:00'}`)
  const diffMs = end.getTime() - start.getTime()
  if (isNaN(diffMs) || diffMs <= 0) return 1
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(1, days)
}

// Modal State & Handlers
const isBookingModalOpen = ref(false)
const bookingModalStep = ref(1) // 1: details, 2: confirmation, 3: success
const modalCar = ref(cars[0])
const modalForm = ref({
  renterName: '',
  phone: '',
  email: '',
  address: '',
  licenseNumber: '',
  licenseExpiry: '',
  pickupDate: today,
  pickupTime: '09:00',
  dropoffDate: tomorrow,
  dropoffTime: '18:00',
  notes: '',
})
const modalError = ref('')
const confirmedBookingId = ref('')
const confirmedBookingSummary = ref(null)

const selectedModalCarName = computed({
  get: () => modalCar.value?.name || cars[0].name,
  set: (val) => {
    const found = cars.find((c) => c.name === val)
    if (found) modalCar.value = found
  },
})

const modalRentalDays = computed(() => {
  return calculateRentalDays(
    modalForm.value.pickupDate,
    modalForm.value.pickupTime,
    modalForm.value.dropoffDate,
    modalForm.value.dropoffTime
  )
})

const modalTotalPrice = computed(() => {
  const price = modalCar.value?.price || 85
  return modalRentalDays.value * price
})

watch(() => modalForm.value.pickupDate, (newPickup) => {
  if (newPickup && modalForm.value.dropoffDate < newPickup) {
    modalForm.value.dropoffDate = newPickup
  }
})

const openBookingModal = (car = null) => {
  if (car) {
    modalCar.value = car
  } else {
    const matching = availabilityForm.value.brand !== 'Any brand'
      ? cars.find((c) => c.brand === availabilityForm.value.brand)
      : null
    modalCar.value = matching || cars[0]
  }

  const pDate = availabilityForm.value.pickupDate || today
  const pTime = availabilityForm.value.pickupTime || '09:00'
  const dDate = availabilityForm.value.dropoffDate || tomorrow
  const dTime = availabilityForm.value.dropoffTime || '18:00'

  modalForm.value = {
    renterName: sessionUser?.fullName || '',
    phone: '',
    email: sessionUser?.email || '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    pickupDate: pDate,
    pickupTime: pTime,
    dropoffDate: dDate,
    dropoffTime: dTime,
    notes: '',
  }
  modalError.value = ''
  bookingModalStep.value = 1
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
  bookingModalStep.value = 1
  modalError.value = ''
}

const goToConfirmation = () => {
  modalError.value = ''
  const f = modalForm.value
  if (!f.renterName || !f.phone || !f.email || !f.address || !f.licenseNumber || !f.licenseExpiry) {
    modalError.value = 'Please complete all required renter information fields.'
    return
  }
  if (f.licenseExpiry < today) {
    modalError.value = 'Driver’s license must not be expired.'
    return
  }
  if (f.dropoffDate < f.pickupDate || (f.dropoffDate === f.pickupDate && f.dropoffTime <= f.pickupTime)) {
    modalError.value = 'Return date and time must be after the borrow date and time.'
    return
  }
  bookingModalStep.value = 2
}

const confirmModalBooking = () => {
  const f = modalForm.value
  const car = modalCar.value
  const days = calculateRentalDays(f.pickupDate, f.pickupTime, f.dropoffDate, f.dropoffTime)
  const totalPrice = days * (car?.price || 85)
  const bookingId = Date.now()
  const refCode = `BK-${String(bookingId).slice(-6)}`

  const renterRecord = {
    id: bookingId,
    bookingId,
    bookingRef: refCode,
    renterName: f.renterName,
    phone: f.phone,
    email: f.email,
    address: f.address,
    licenseNumber: f.licenseNumber,
    licenseExpiry: f.licenseExpiry,
    brand: car.brand,
    carName: car.name,
    pickupDate: f.pickupDate,
    pickupTime: f.pickupTime,
    dropoffDate: f.dropoffDate,
    dropoffTime: f.dropoffTime,
    durationDays: days,
    totalPrice,
  }

  const bookingRecord = {
    id: bookingId,
    bookingRef: refCode,
    customer: f.renterName,
    renterName: f.renterName,
    phone: f.phone,
    email: f.email,
    address: f.address,
    licenseNumber: f.licenseNumber,
    licenseExpiry: f.licenseExpiry,
    brand: car.brand,
    carName: car.name,
    pickupDate: f.pickupDate,
    pickupTime: f.pickupTime,
    dropoffDate: f.dropoffDate,
    dropoffTime: f.dropoffTime,
    durationDays: days,
    totalPrice,
    notes: f.notes,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  }

  renterInformation.value.unshift(renterRecord)
  bookings.value.unshift(bookingRecord)
  persistBookings()
  persistRenters()

  confirmedBookingId.value = refCode
  confirmedBookingSummary.value = {
    carName: car.name,
    brand: car.brand,
    type: car.type,
    rate: car.price,
    renterName: f.renterName,
    phone: f.phone,
    email: f.email,
    pickupDate: f.pickupDate,
    pickupTime: f.pickupTime,
    dropoffDate: f.dropoffDate,
    dropoffTime: f.dropoffTime,
    days,
    totalPrice,
  }

  bookingModalStep.value = 3
}

const viewBookingsFromModal = () => {
  closeBookingModal()
  activeView.value = 'bookings'
}

const viewRenterInfoFromModal = () => {
  closeBookingModal()
  activeView.value = 'renter-information'
}

const continueWithVehicle = (car) => {
  openBookingModal(car)
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isBookingModalOpen.value) {
    closeBookingModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

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

/* Streamlined Schedule & Date Layout */
.streamlined-schedule-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
}

.schedule-pair,
.form-schedule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 640px) {
  .schedule-pair,
  .form-schedule-grid {
    grid-template-columns: 1fr;
  }
}

.nav-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: inherit;
}

.nav-text-label {
  font-weight: 500;
}

.new-booking-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.search-svg {
  color: var(--muted, #6d7b8d);
  flex-shrink: 0;
}

.availability-car-badge {
  display: inline-block;
  padding: 4px 8px;
  background: var(--brand-soft, #eaf3ff);
  color: var(--brand, #0f6fff);
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.car-badge-pill {
  padding: 8px 14px;
  background: #f1f5f9;
  color: #334155;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.place-marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand, #0f6fff);
  display: inline-block;
  margin-right: 6px;
}

/* Overview Car Card Booking Button */
.card-book-btn {
  width: 100%;
  margin-top: 14px;
  padding: 11px 16px;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card-book-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(15, 111, 255, 0.32);
}

.quick-booking-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.quick-booking-actions .primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.small-btn {
  padding: 8px 14px;
  font-size: 12px;
  white-space: nowrap;
}

.booking-ref-tag {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 6px;
  background: rgba(15, 111, 255, 0.1);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
}

.booking-price-tag {
  display: inline-block;
  color: var(--accent-dark);
  font-weight: 700;
  font-size: 12px;
}

/* Modal Backdrop & Container */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-dialog {
  background: #ffffff;
  width: 100%;
  max-width: 660px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(148, 163, 184, 0.15);
  overflow: hidden;
  animation: modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideUp {
  from {
    transform: translateY(20px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px 18px;
  border-bottom: 1px solid var(--line);
  background: linear-gradient(180deg, #f8faff 0%, #ffffff 100%);
}

.modal-eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.45rem;
  color: var(--text);
  line-height: 1.2;
}

.modal-close-btn {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: var(--text);
  transform: rotate(90deg);
}

/* Modal Stepper Indicator */
.modal-steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 28px;
  background: #fbfdff;
  border-bottom: 1px solid var(--line);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.step-item.active {
  color: var(--accent-dark);
}

.step-item.completed {
  color: #10b981;
}

.step-number {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.step-item.active .step-number {
  background: var(--accent);
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 111, 255, 0.35);
}

.step-item.completed .step-number {
  background: #10b981;
  color: #ffffff;
}

.step-line {
  flex: 1;
  max-width: 48px;
  height: 2px;
  background: #e2e8f0;
  border-radius: 2px;
}

.step-line.filled {
  background: #10b981;
}

/* Modal Body */
.modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

/* Vehicle Banner in Modal */
.modal-vehicle-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  background: linear-gradient(135deg, #eef5ff 0%, #f4f8fe 100%);
  border: 1px solid rgba(15, 111, 255, 0.18);
  border-radius: 16px;
}

.modal-vehicle-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: #ffffff;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(15, 111, 255, 0.12);
}

.modal-vehicle-info {
  flex: 1;
  min-width: 0;
}

.modal-vehicle-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.modal-vehicle-title h3 {
  margin: 0;
  font-size: 1.15rem;
  color: var(--text);
}

.modal-badge {
  font-size: 11px;
  font-weight: 700;
  color: var(--accent-dark);
  background: rgba(15, 111, 255, 0.12);
  padding: 2px 8px;
  border-radius: 6px;
}

.modal-vehicle-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.modal-vehicle-tags span {
  font-size: 11px;
  color: #475569;
  background: #ffffff;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  font-weight: 500;
}

.modal-vehicle-rate {
  text-align: right;
  flex-shrink: 0;
}

.rate-label {
  display: block;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.modal-vehicle-rate strong {
  font-size: 1.35rem;
  color: var(--accent-dark);
}

.modal-vehicle-rate strong small {
  font-size: 12px;
  color: var(--muted);
}

/* Modal Form Section Headers */
.modal-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
  margin-top: 6px;
}

.modal-section-title h4 {
  margin: 0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #475569;
  font-weight: 700;
}

.modal-section-hint {
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
}

.full-width {
  grid-column: 1 / -1;
}

/* Modal Price Box */
.modal-price-box {
  padding: 16px 18px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #475569;
}

.price-row.total-highlight {
  padding-top: 8px;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.total-amount {
  font-size: 1.35rem;
  color: var(--accent-dark);
}

.modal-error-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
}

/* Step 2: Confirmation Screen */
.confirmation-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.confirmation-notice strong {
  display: block;
  font-size: 13px;
  margin-bottom: 2px;
}

.confirmation-notice small {
  display: block;
  font-size: 12px;
  color: #3b82f6;
}

.confirmation-card {
  background: #fafcff;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
}

.confirm-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.confirm-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  font-weight: 700;
}

.confirm-car-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.confirm-car-row h4 {
  margin: 0 0 2px;
  font-size: 1.15rem;
  color: var(--text);
}

.confirm-car-row p {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}

.confirm-car-rate {
  font-size: 1.1rem;
  color: var(--accent-dark);
  white-space: nowrap;
}

.confirm-divider {
  height: 1px;
  background: var(--line);
  margin: 16px 0;
}

.confirm-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.confirm-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.confirm-item.full-span {
  grid-column: 1 / -1;
}

.confirm-item strong {
  font-size: 13px;
  color: var(--text);
  overflow-wrap: break-word;
}

.confirm-price-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 4px;
}

.confirm-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #475569;
}

.confirm-price-row.total {
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.confirm-price-row.total strong {
  font-size: 1.45rem;
  color: var(--accent-dark);
}

/* Step 3: Success Screen */
.success-view {
  text-align: center;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.35);
  animation: successPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes successPop {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }
  100% {
    transform: scale(1);
  }
}

.success-view h3 {
  margin: 0;
  font-size: 1.55rem;
  color: #0f172a;
}

.success-subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
}

.booking-ref-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(15, 111, 255, 0.12);
  color: var(--accent);
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-left: 4px;
}

.success-card {
  width: 100%;
  max-width: 520px;
  background: #f8fbff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  margin-top: 6px;
}

.success-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.success-summary-row span {
  color: var(--muted);
  flex-shrink: 0;
}

.success-summary-row strong {
  color: var(--text);
  text-align: right;
  overflow-wrap: break-word;
}

.success-price {
  color: #059669 !important;
  font-size: 14px;
}

.success-instructions {
  width: 100%;
  max-width: 520px;
  padding: 12px 16px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  color: #92400e;
  font-size: 13px;
  text-align: left;
}

.success-instructions p {
  margin: 0;
  line-height: 1.45;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 28px;
  border-top: 1px solid var(--line);
  background: #ffffff;
}

.modal-footer button {
  min-height: 44px;
}

.confirm-action-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  box-shadow: 0 10px 22px rgba(16, 185, 129, 0.3) !important;
}

.confirm-action-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .modal-dialog {
    max-height: 94vh;
    border-radius: 18px;
  }
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 18px;
    padding-right: 18px;
  }
  .confirm-grid {
    grid-template-columns: 1fr;
  }
  .modal-footer {
    flex-direction: column-reverse;
  }
  .modal-footer button {
    width: 100%;
  }
}

</style>
