<script setup lang="ts">

const props = defineProps<{
  label: string;
  color: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: object): void;
}>();

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const data = {
    label: props.label,
    color: target.value
  };

  emit("update:modelValue", data);
}

</script>

<template>
  <div class="settings__color-picker">
    <label>{{ props.label }}</label>
    <input 
      type="color"
      @input="onInput"
      class="settings__color-input" 
    />

    <!-- Preview -->
    <div
      class="settings__color-preview"
      :style="{ backgroundColor: props.color }"
    ></div>

    <!-- Hex -->
    <span class="settings__color-hex">
      {{ props.color }}
    </span>
  </div>
</template>

<style scoped>
.settings__color-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
}
</style>
