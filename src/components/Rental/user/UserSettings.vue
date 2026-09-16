<template>
  <div class="view-section">
    <div class="panel-card">
      <h2>Business settings</h2>
      <div class="setting-list">
        <div v-for="setting in settings" :key="setting.label" class="setting-item" @click="setting.enabled = !setting.enabled" style="cursor: pointer;">
          <div>
            <strong>{{ setting.label }}</strong>
            <span>{{ setting.note }}</span>
          </div>
          <div :class="['switch', { on: setting.enabled }]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { initialSettings } from '../shared/rentalData'

const settings = ref(initialSettings)
</script>
