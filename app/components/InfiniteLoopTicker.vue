<script setup>
import { technologies } from "../assets/assets";
</script>

<template>
  <section class="mt-6 w-full">
    <!-- Card shell -->
    <div
      class="relative mx-auto w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden"
    >
      <!-- Top subtle highlight -->
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />


      <!-- Marquee window -->
      <div class="relative py-4 sm:py-5">
        <!-- soft edge fades -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[var(--bg-color-primary)]/90 to-transparent z-10" />
        <div class="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[var(--bg-color-primary)]/90 to-transparent z-10" />

        <div class="marquee-window px-3 sm:px-6">
          <div class="marquee-track">
            <!-- Group A -->
            <div class="marquee-group">
              <div
                v-for="(t, i) in technologies"
                :key="`a-${i}`"
                class="tech-chip"
                :title="t.name"
              >
                <div class="tech-icon">
                  <img
                    :src="t.image"
                    :alt="t.name"
                    class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                    loading="lazy"
                  />
                </div>
                <span class="tech-label hidden sm:inline">{{ t.name }}</span>
              </div>
            </div>

            <!-- Group B (duplicate) -->
            <div class="marquee-group" aria-hidden="true">
              <div
                v-for="(t, i) in technologies"
                :key="`b-${i}`"
                class="tech-chip"
                :title="t.name"
              >
                <div class="tech-icon">
                  <img
                    :src="t.image"
                    :alt="t.name"
                    class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                    loading="lazy"
                  />
                </div>
                <span class="tech-label hidden sm:inline">{{ t.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-window {
  overflow: hidden;
  position: relative;
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 0.9rem;
  will-change: transform;
  animation: marquee 22s linear infinite;
}

.marquee-group {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding-right: 0.9rem;
}

/* Pause on hover (desktop) */
@media (hover: hover) and (pointer: fine) {
  .marquee-track:hover {
    animation-play-state: paused;
  }
}

/* Slower on desktop */
@media (min-width: 768px) {
  .marquee-track {
    animation-duration: 28s;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    transform: translateX(0);
  }
}

/* Seamless loop: move exactly half (A+B duplicated) */
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Chips */
.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;

  padding: 0.55rem 0.8rem;
  border-radius: 9999px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);

  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);

  transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
}

.tech-chip:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.18);
}

.tech-icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

@media (min-width: 640px) {
  .tech-icon {
    width: 2.25rem;
    height: 2.25rem;
  }
}

.tech-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
  white-space: nowrap;
}
</style>