<script setup lang="ts">
import { useNuxtApp } from '#app';
import { XMarkIcon, PencilSquareIcon, XCircleIcon } from "@heroicons/vue/24/outline";

const { $toast } = useNuxtApp();

defineProps<{
  show: boolean;
  title: string;
  content: string;
  buttonText: string;
  typeModal: number; // 1: create & 2: edit
  form: {
    username: string;
    email: string;
    password: string;
  };
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "confirm"): void;
}>();

const closeModal = () => {
  emit("close");
};

const confirmAction = () => {
  $toast.info("Editing permissions...");
  emit("confirm");
};
</script>

<template>
  <!-- BACKDROP -->
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <!-- MODAL -->
    <div
      class="w-full max-w-md rounded-2xl bg-[var(--bg-color-secondary)] border border-black/40 p-6 text-white"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">
          {{ title }}
        </h2>

        <button
          class="p-2 rounded-lg hover:bg-black/30 transition"
          @click="closeModal"
        >
          <XMarkIcon class="w-5 h-5 text-gray-300" />
        </button>
      </div>

      <!-- CONTENT -->
      <p class="text-gray-300 mb-6 leading-relaxed">
        {{ content }}
      </p>

      <!-- FORM -->
      <div class="space-y-4 mb-6">
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="w-full rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]"
        />
        <input
          :disabled="typeModal === 2"
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="cursor-not-allowed w-full rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]"
        />
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-3">
        <!-- CANCEL -->
        <button
          class="flex pl-2 pr-4 py-2 rounded-xl bg-[var(--bg-color-third)] text-white hover:bg-black/30 transition"
          @click="closeModal"
        >
          <XCircleIcon class="w-6 h-6 mr-1" />
          Cancel
        </button>

        <!-- CONFIRM -->
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-base)] text-black font-semibold hover:brightness-95 transition btn__shadow"
          @click="$emit('confirm')"
        >
          <PencilSquareIcon class="w-4 h-4" />
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
