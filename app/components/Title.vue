<script setup lang="ts">
import { computed } from "vue";

type HeadingSize = 1 | 2 | 3 | 4;

const props = withDefaults(
  defineProps<{
    text: string;
    size?: HeadingSize; // 1..4 => h1..h4
  }>(),
  {
    text: "",
    size: 2,
  }
);

const tag = computed(() => (`h${props.size}` as const));

// Optional: adjust text size by heading level
const sizeClass = computed(() => {
  switch (props.size) {
    case 1: return "md:text-3xl text-xl";
    case 2: return "md:text-2xl text-xl";
    case 3: return "md:text-xl";
    case 4: return "md:text-lg";
    default: return "md:text-2xl";
  }
});
</script>

<template>
  <component
    :is="tag"
    class="btn__base_3 flex items-center justify-center border-2 border-[var(--color-dark)] bg-[var(--bg-color-secondary)]"
    :class="sizeClass"
  >
    {{ text }}
  </component>
</template>
