<template>
  <!-- Vertical -->
  <div
    v-if="vertical"
    class="inline-block w-px self-stretch bg-gray-200"
    :class="props.customizeClass"
    role="separator"
    aria-orientation="vertical"
  />
  <!-- Horizontal -->
  <div
    v-else
    class="w-full h-px bg-gray-200"
    :class="props.customizeClass"
    role="separator"
    aria-orientation="horizontal"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    vertical?: boolean;
    customizeClass?: string;
  }>(),
  {
    vertical: false,
    customizeClass: "",
  }
);
</script>