<script setup>
definePageMeta({ layout: "modules" });

import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../../stores/settings";
import ModalCode from "../../components/ModalCode.vue";
import ColorPalette from "../../components/ColorPalette.vue";
import ColorPaletteSource from "../../components/ColorPalette.vue?raw";

const showCode = ref(false);
const settings = useSettingsStore();
const { background, colorPalette, colorButtons } = storeToRefs(settings);
const slider = ref(settings.background === "white" ? 100 : 0);
const config = [
  { label: "Modules", model: colorPalette },
  { label: "Buttons", model: colorButtons },
];

const updateBackground = () => {
  try {
    settings.setBackground(
      slider.value > 80 ? "white" : slider.value >= 50 ? "gray" : "#24947",
    );
  } catch (error) {
    alert(`Something went wrong: ${error}.`);
  }
};

const updateColor = ({ label, color }) => {
  switch (label) {
    case "Modules":
      settings.setColorPalette(color);
      break;
    case "Buttons":
      settings.setColorButtons(color);
      break;
    default:
      break;
  }
};
</script>

<template>
  <section class="settings">
    <h2 class="settings__title">Settings</h2>

    <section>
      <div v-for="(item, index) in config" :key="index">
        <ColorPalette
          @update:modelValue="updateColor($event)"
          :label="item.label"
          :color="item.model"
        />
      </div>
    </section>
  </section>
</template>

<style scoped>
.code-preview {
  margin-top: 16px;
  padding: 16px;
  background: #0f172a;
  color: #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  overflow-x: auto;
  max-height: 400px;
}
</style>
