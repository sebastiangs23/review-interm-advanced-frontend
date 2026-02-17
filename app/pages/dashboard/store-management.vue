<script setup>
definePageMeta({ layout: "modules" });

import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../../stores/settings";
import Title from "../../components/Title.vue"
import ModalCode from "../../components/modals/ModalCode.vue";
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
    <Title text="Store Managment Pinia" :size="1" />
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
/* Page wrapper */
.settings {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Title */
.settings__title {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.3px;
  color: #0f172a;
  margin-bottom: 8px;
}

/* Inner section (cards container) */
.settings > section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* Individual setting card (ColorPalette wrapper) */
.settings > section > div {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover polish */
.settings > section > div:hover {
  transform: translateY(-2px);
  box-shadow:
    0 14px 38px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

/* Optional divider feel between cards (subtle) */
.settings > section > div::after {
  content: "";
  display: block;
  margin-top: 16px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 0, 0, 0.06),
    transparent
  );
}

/* Code preview (you already had this, slightly refined) */
.code-preview {
  margin-top: 16px;
  padding: 16px;
  background: #0f172a;
  color: #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  overflow-x: auto;
  max-height: 400px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
</style>
