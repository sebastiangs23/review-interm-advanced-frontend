<script setup lang="ts">
import { onMounted, reactive, watch, computed } from "vue";
import { useToast } from "vue-toastification";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { subModules } from "../../utils/common";

import type { User } from "../../types/user.d.ts";

const props = defineProps<{
  show: boolean;
  user: User;
  modelValue?: Record<string, boolean>;
}>();


const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", permissions: Record<string, boolean>): void;
}>();

const toast = useToast();

const iconMap = computed(() => {
  return Object.fromEntries(subModules.map((m) => [m.name, m.icon]));
});

//TODO: Add error handling 
const savePermissions = () => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const updatedUsers = users.map((u: User) =>
    u.email === props.user.email ? props.user : u
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  emit('close')
  toast.success(
      `User "${props.user?.username}" permissions updated successfully.`,
    );

};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  >
    <div
      class="w-full max-w-lg rounded-2xl bg-[var(--bg-color-secondary)] border border-black/40 p-6 text-white"
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl font-bold">Manage Permissions</h2>
          <p class="text-gray-300 text-sm">
            Permissions for
            <span class="font-semibold">{{ user?.username }}</span>
          </p>
        </div>

        <button
          class="p-2 rounded-lg hover:bg-black/30 transition"
          @click="$emit('close')"
        >
          <XMarkIcon class="w-5 h-5 text-gray-300" />
        </button>
      </div>
      <!-- MODULES -->
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div
          v-for="module in user?.submodules"
          :key="module.submodule"
          class="flex items-center justify-between rounded-xl border border-black/30 bg-black/20 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <component
              :is="iconMap[module.submodule]"
              class="w-5 h-5 text-gray-300"
            />
            <span class="font-medium">{{ module.submodule }}</span>
          </div>

          <!-- CHECKBOX -->
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              v-model="module.access"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-black/40 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[var(--color-base)] peer-checked:after:translate-x-full"
            ></div>
          </label>
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          class="px-4 py-2 rounded-xl bg-[var(--bg-color-third)] text-white hover:bg-black/30 transition"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-base)] text-black font-semibold hover:brightness-95 transition btn__shadow"
          @click="savePermissions"
        >
          <CheckCircleIcon class="w-4 h-4 stroke-[2.5]" />
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>
