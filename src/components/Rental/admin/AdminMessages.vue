<template>
  <div class="view-section">
    <div class="panel-card">
      <h2>Messages</h2>
      <div class="message-list">
        <div v-for="message in messages" :key="message.name" class="message-item">
          <div>
            <strong>{{ message.name }}</strong>
            <span>{{ message.preview }}</span>
          </div>
          <span>{{ message.time }}</span>
          <span :class="['status-badge', message.type]">{{ message.typeLabel }}</span>
        </div>
        <p v-if="!messages.length" class="empty-message">No messages yet.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { initialMessages } from '../shared/rentalData'

const messages = ref(initialMessages)
</script>
