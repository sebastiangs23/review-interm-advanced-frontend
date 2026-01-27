<script setup lang="ts">
</script>

<template>
  <div class="loader">
    <div class="loader__content">
      <span class="loader__ring"></span>
      <span class="loader__text">Loading</span>
    </div>
  </div>
</template>

<style scoped>
/* Overlay */
.loader {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  display: grid;
  place-items: center;
  z-index: 9999;
}

/* Content */
.loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* Spinner ring */
.loader__ring {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 4px solid rgba(79, 173, 190, 0.25);
  border-top-color: #4fadbe;
  animation: spin 0.9s linear infinite;
}

/* Text */
.loader__text {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #4fadbe;
  animation: fade 1.2s ease-in-out infinite;
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
