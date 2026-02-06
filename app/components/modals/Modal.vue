<script setup lang="ts">
import { useToast } from "vue-toastification";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

const toast = useToast();

defineProps<{
  show: boolean;
  title: string;
  content: string;
  buttonText: string;
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
  toast.info("Editing permissions...");
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

      <!-- TODO: Style the form acording to the color palette -->
      <!-- FORM -->
      <div class="space-y-4 mb-6">
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="w-full rounded-lg p-2 text-black"
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="w-full rounded-lg p-2 text-black"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full rounded-lg p-2 text-black"
        />
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-3">
        <!-- CANCEL -->
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--delete-color)] text-white font-semibold hover:brightness-95 transition"
          @click="closeModal"
        >
          <XMarkIcon class="w-4 h-4" />
          Cancel
        </button>

        <!-- CONFIRM -->
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--edit-color)] text-white font-semibold hover:brightness-95 transition btn__shadow"
          @click="$emit('confirm')"
        >
          <PencilSquareIcon class="w-4 h-4" />
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>
