<script setup>
definePageMeta({ layout: "modules" });

import { ref, watch } from "vue";
import { useSettingsStore } from "../../../stores/settings";
import ColorPalette from "../../components/ColorPalette.vue";

const settings = useSettingsStore();
const slider = ref(settings.background === "white" ? 100 : 0);
const colorPalette = ref(settings.colorPalette);
const colorButtons = ref(settings.colorButtons);

//mock delete later and make it reusable with the line 6
const config = [
  { label: "Color Palette Modules", model: ref(settings.colorPalette) },
  { label: "Color Palette Buttons", model: ref(settings.colorButtons) },
];

const updateBackground = () => {
  try {
    settings.setBackground(
      slider.value > 80 ? "white" : slider.value >= 50 ? "gray" : "#24947"
    );
  } catch (error) {
    alert(`Something went wrong: ${error}.`);
  }
};

// sincroniza cuando cambia el color
watch(colorPalette, (newColor) => {
  settings.setColorPalette(newColor);
});

watch(colorButtons, (newColor) => {
  settings.setColorButtons(newColor);
});
</script>

<template>
  <section class="settings">
    <h2 class="settings__title">Settings</h2>

    <section class="settings__section">
      <div>
        <label>Background Color:</label>
        <input
          type="range"
          min="0"
          max="100"
          v-model="slider"
          @input="updateBackground"
        />
        <span>{{
          settings.background === "white" ? "🌤 White" : "🌫 Gray"
        }}</span>
      </div>

      <div class="settings__color-picker">
        <label>Color Palette Modules</label>
        <input
          type="color"
          v-model="colorPalette"
          class="settings__color-input"
        />

        <!-- Preview -->
        <div
          class="settings__color-preview"
          :style="{ backgroundColor: colorPalette }"
        ></div>

        <!-- Hex -->
        <span class="settings__color-hex">
          {{ colorPalette }}
        </span>
      </div>
    </section>

    <section>
      <div v-for="(item, index) in config" :key="index">
        <ColorPalette
          :label="item.label"
          :color="item.model"
        />
      </div>
    </section>
  </section>
</template>

<style scoped>
.settings__section {
  margin-top: 1.5rem;
}

.settings__label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.settings__color-picker {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.settings__color-input {
  width: 42px;
  height: 42px;
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
}

.settings__color-preview {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.settings__color-hex {
  font-family: monospace;
  font-size: 0.9rem;
  opacity: 0.8;
}

</style>