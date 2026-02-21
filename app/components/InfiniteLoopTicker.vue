<script setup>
import { technologies } from "../assets/assets";
</script>

<template>
  <section class="mt-6 relative left-1/2 -translate-x-1/2">
    <div class="relative overflow-hidden border border-black/10 bg-white/10">
      <div class="py-3 md:py-4">
        <div class="marquee-window mx-auto w-full max-w-150 px-3">
          <div class="marquee-track">
            <div class="marquee-group">
              <div
                v-for="(t, i) in technologies"
                :key="`a-${i}`"
                class="shrink-0 px-3 py-2 rounded-full border border-black/10 bg-black/10"
              >
                <img
                  :src="t.image"
                  :alt="t.name"
                  class="h-8 w-8 md:h-12 md:w-12 object-contain"
                />
              </div>
            </div>

            <div class="marquee-group" aria-hidden="true">
              <div
                v-for="(t, i) in technologies"
                :key="`b-${i}`"
                class="shrink-0 px-3 py-2 rounded-full border border-black/10 bg-black/10"
              >
                <img
                  :src="t.image"
                  :alt="t.name"
                  class="h-8 w-8 md:h-12 md:w-12 object-contain"
                />
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

  /* no fade by default (<600px) */
  -webkit-mask-image: none;
  mask-image: none;
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 0.75rem;
  will-change: transform;

  animation: marquee 18s linear infinite;
}

.marquee-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.75rem;
}

/* slower on desktop */
@media (min-width: 768px) {
  .marquee-track {
    animation-duration: 24s;
  }
}

/* fade edges only >= 600px */
@media (min-width: 600px) {
  .marquee-window {
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 12%,
      black 88%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 12%,
      black 88%,
      transparent 100%
    );
  }
}

/* reduce motion support */
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    transform: translateX(0);
  }
}

/* ✅ seamless loop: move exactly half (because we duplicated A+B) */
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
