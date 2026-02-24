<script setup lang="ts">
import { computed, useSlots } from "vue";

const props = withDefaults(
  defineProps<{
    text: string;
    colorText?: string;
    class?: string;
    toolTipActive: boolean;
  }>(),
  {
    colorText: "#FFFFFF",
    toolTipActive: true,
  },
);
</script>

<template>
  <span
    class="relative inline-flex justify-center items-center gap-1.5 select-none group"
    :class="[
      'rounded-md px-3 py-1 text-xs font-semibold leading-none',
      'text-black bg-[var(--color-base)]',
      props.class,
    ]"
  >
    <!-- texto truncado -->
    <span class="min-w-0 truncate">
      {{ text }}
    </span>

    <span
      v-show="toolTipActive"
      class="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-max max-w-[260px] -translate-x-1/2 rounded-md px-2 py-1 text-[11px] font-medium leading-snug text-white bg-black/80 shadow-lg opacity-0 scale-95 transition duration-150 ease-out group-hover:opacity-100 group-hover:scale-100"
      >{{ text }}</span
    >
  </span>
</template>
