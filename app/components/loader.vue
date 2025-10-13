<template>
  <div class="loader">
    <div class="spinner">Loading...</div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  font-weight: 600;
  color: #4fadbe;
  font-size: 1.2rem;
  animation: pulse 1s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
</style>
