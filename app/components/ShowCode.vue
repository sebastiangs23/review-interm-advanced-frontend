<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import ModalCode from "../components/modals/ModalCode.vue";
import { useWindowWidth } from "../composables/useWidth";

import { subModules } from "../utils/common";

const props = defineProps<{
  show: boolean;
}>();

const route = useRoute();
const showCode = ref<Boolean>(false);
const { width } = useWindowWidth();

const isMobile = computed(() => width.value < 640);
const isMdUp = computed(() => width.value >= 768);

const currentSubModule = computed(() => {
  const path = route.path?.split("/")[2];
  const module = subModules.find((mod) => mod.route === path);
  
  return module;
});

const closeModal = () => {
  showCode.value = false;
};
</script>

<template>
  <header class="flex">
      <button class="btn rounded-lg btn__shadow text-[0.65rem] sm:text-base" @click="showCode = true">
        {{  isMobile ? "<ShowCode />" : `<ShowCode path="${currentSubModule ? currentSubModule.route : "-"}" />` }}
        {{  }}
      </button>

      <ModalCode
        @close="closeModal()"
        :title="currentSubModule ? currentSubModule.name : 'Component'"
        :sourceCode="currentSubModule?.source"
        :show="showCode"
      />
  </header>
</template>

<style scoped>
.show-code {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.2px;
  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}

/* Hover */
.show-code:hover {
  background: #f8fafc;

  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.9);
}

/* Active */
.show-code:active {
  transform: translateY(1px);
}

/* Focus (keyboard) */
.show-code:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.35);
}
</style>
