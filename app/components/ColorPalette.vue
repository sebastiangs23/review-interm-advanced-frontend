<script setup lang="ts">
// import { ref } from "vue";
// import { useSettingsStore } from "../../stores/settings";

const props = defineProps<{
  label: string;
  color: string;
}>();

// const settings = useSettingsStore();

// const colorPalette = ref(settings.colorPalette);

</script>

<template>
  <div class="settings__color-picker">
    <label>{{ props.label }}</label>
    <input type="color" v-model="props.color" class="settings__color-input" />

    <!-- Preview -->
    <div
      class="settings__color-preview"
      :style="{ backgroundColor: props.color }"
    ></div>

    <!-- Hex -->
    <span class="settings__color-hex">
      {{ props.color }}
    </span>

    <pre> ey: {{props.color}} </pre>
  </div>
</template>

<style scoped></style>
