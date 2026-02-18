<script setup lang="ts">
import { XMarkIcon, TrashIcon, XCircleIcon } from "@heroicons/vue/24/outline";

defineProps<{
  show: boolean;
  title: string;
  description: string;
  leftButton: string;
  rightButton: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-[var(--bg-color-secondary)] border border-black/40 p-6 text-white"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">{{ title }}</h2>

        <button
          class="p-2 rounded-lg hover:bg-black/30 transition"
          @click="$emit('close')"
        >
          <XMarkIcon class="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <!-- BODY -->
      <p class="text-gray-300 mb-6">
        {{ description }}
      </p>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-3">
        <button
          class="flex px-4 py-2 rounded-xl bg-[var(--bg-color-third)] text-white hover:bg-black/30 transition"
          @click="$emit('close')"
        >
          <XCircleIcon class="w-6 h-6 mr-1" />
          {{leftButton}}
        </button>

        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--delete-color)] text-white font-semibold hover:brightness-95 transition"
          @click="$emit('confirm')"
        >
          {{rightButton}}
        </button>
      </div>
    </div>
  </div>
</template>
