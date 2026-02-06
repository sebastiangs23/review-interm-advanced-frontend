<script setup lang="ts">
import { onMounted, reactive, watch } from "vue";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";
import { subModules } from "../../utils/common";

defineProps<{
  show: boolean;
  user: object;
  modelValue?: Record<string, boolean>;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", permissions: Record<string, boolean>): void;
}>();

const permissions = reactive<Record<string, boolean>>({});

/**
 * Initialize permissions when modal opens
 */
watch(
  () => subModules,
  () => {
    subModules.forEach((module) => {
      if (!(module.route in permissions)) {
        permissions[module.route] = false;
      }
    });
  },
  { immediate: true }
);

const savePermissions = () => {
  emit("save", { ...permissions });
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
            Permissions for <span class="font-semibold">{{ user?.username }}</span>
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
          v-for="module in subModules"
          :key="module.name"
          class="flex items-center justify-between rounded-xl border border-black/30 bg-black/20 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <component :is="module.icon" class="w-5 h-5 text-gray-300" />
            <span class="font-medium">{{ module.name }}</span>
          </div>

          <!-- CHECKBOX -->
          <label class="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              v-model="permissions[module.name.toLowerCase()]"
              class="peer sr-only"
            />
            <div
              class="peer h-6 w-11 rounded-full bg-black/40
                     after:absolute after:left-[2px] after:top-[2px]
                     after:h-5 after:w-5 after:rounded-full after:bg-white
                     after:transition-all peer-checked:bg-[var(--color-base)]
                     peer-checked:after:translate-x-full"
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
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-base)] text-black  font-semibold hover:brightness-95 transition btn__shadow"
          @click="savePermissions"
        >
          <CheckCircleIcon class="w-4 h-4 stroke-[2.5]" />
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>