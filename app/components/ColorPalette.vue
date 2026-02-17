<script setup lang="ts">

const props = defineProps<{
  label: string;
  color: string;
  showHex?: boolean;
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
  <div class="flex items-center gap-[1rem] p-[0.5rem 0] text-white">
    <label>{{ props.label }}</label>
    <input 
      type="color"
      @input="onInput"
    />

    <div
      :style="{ backgroundColor: props.color }"
    ></div>

    <span v-show="props.showHex" class="settings__color-hex">
      {{ props.color }}
    </span>
  </div>
</template>