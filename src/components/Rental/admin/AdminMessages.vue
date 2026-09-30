<template>
  <div class="view-section">
    <div class="panel-card">
      <div class="header-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Messages</h2>
        <button class="secondary-button" style="padding: 6px 12px; font-size: 12px;" @click="loadMessages">Refresh</button>
      </div>
      <div class="message-list">
        <div v-for="message in messages" :key="message.id || message.name" class="message-item">
          <div>
            <strong>{{ message.senderName || message.name || 'User' }}</strong>
            <span>{{ message.content || message.body || message.preview || message.subject }}</span>
          </div>
          <span>{{ message.createdAt ? new Date(message.createdAt).toLocaleDateString() : message.time }}</span>
          <span :class="['status-badge', message.isRead ? 'confirmed' : 'pending']">
            {{ message.isRead ? 'Read' : 'New' }}
          </span>
        </div>
        <p v-if="!messages.length" class="empty-message">No messages in inbox.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../../../api/client'
import { initialMessages } from '../shared/rentalData'

const messages = ref(initialMessages)
const isLoading = ref(false)

const loadMessages = async () => {
  isLoading.value = true
  try {
    const data = await api('/messages')
    if (Array.isArray(data) && data.length > 0) {
      messages.value = data
    }
  } catch (err) {
    console.warn('Using local messages fallback:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadMessages()
})
</script>

