<script setup lang="ts">
import { defineEmits } from "vue";

defineProps<{
  show: boolean;
  title: string;
  content: string;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div class="modal" v-show="show">
    <div class="modal__content">
      <h2>{{ title }}</h2>
      <h4>{{ content }}</h4>

      <div class="modal__actions">
        <button type="button" class="modal__btn modal__btn--edit" @class="edit">
          Edit
        </button>
        <button type="button" class="modal__btn modal__btn--cancel" @click="closeModal">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-content: center;
  justify-content: center;
}

.modal__content {
  background: white;
  padding: 2rem;
  border-radius: 0.8rem;
  width: 400px;
}
.modal__actions {
  display: flex;
}
</style>
