<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    active: boolean;
    text?: string;
    subtext?: string;
    blur?: boolean;
    block?: boolean;
  }>(),
  {
    text: "Loading",
    subtext: "Up to youuu",
    blur: true,
    block: true,
  },
);
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="active"
      class="absolute inset-0 z-20 grid place-items-center"
      :class="[
        blur ? 'backdrop-blur-sm' : '',
        block ? 'pointer-events-auto' : 'pointer-events-none',
      ]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/10" />

      <!-- panel -->
      <div
        class="relative flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-black/10"
      >
        <!-- spinner (nicer) -->
        <span
          class="relative inline-flex h-10 w-10 items-center justify-center"
        >
          <span
            class="absolute h-10 w-10 rounded-full border-2 border-black/10"
          />
          <span
            class="absolute h-10 w-10 rounded-full border-2 border-[var(--color-base)] border-t-transparent animate-spin"
            style="animation-duration: 0.8s"
          />
          <span
            class="h-2.5 w-2.5 rounded-full bg-[var(--color-base)] opacity-90"
          />
        </span>

        <div class="leading-tight">
          <p class="text-sm font-semibold text-black/80">{{ text }}</p>
          <p class="text-xs text-black/50">{{ subtext }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>
