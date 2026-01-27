<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

import ModalCode from "../components/ModalCode.vue";

import { subModules } from "../utils/common";

const props = defineProps<{
  show: boolean;
}>();

const showCode = ref<Boolean>(false);
const route = useRoute();

const currentSubModule = computed(() => {
  const path = route.path?.split("/")[2];
  const module = subModules.find((mod) => mod.route === path);
  return module;
});

const closeModal = () => {
  console.log('The emit is getting executed');
  showCode.value = false;
};
</script>

<template>
  <header class="container__header">
      <button class="show-code" @click="showCode = true">
        {{ `<ShowCode path="${currentSubModule ? currentSubModule.route : "-"}" />` }}
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
.container__header {
    display: flex;
    gap: 12px;
}

.show-code {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid;
  background: rgba(9, 160, 7, 0.55);
  color: rgba(226, 232, 240, 0.92);
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.2px;
  cursor: pointer;
}

.show-code:hover {
  background: rgba(9, 130, 6, 0.55);
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.32),
    0 0 0 3px rgba(59, 246, 93, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.show-code:active {
  transform: translateY(1px);
}

.show-code:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.35),
    0 14px 38px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}
</style>
