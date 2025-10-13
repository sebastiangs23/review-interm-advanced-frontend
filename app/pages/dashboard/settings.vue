<template>
  <section class="settings">
    <h2 class="settings__title">Settings</h2>

    <div class="settings__section">
      <label>Background Color:</label>
      <input
        type="range"
        min="0"
        max="100"
        v-model="slider"
        @input="updateBackground"
      />
      <span>{{ settings.background === "white" ? "🌤 White" : "🌫 Gray" }}</span>
    </div>
  </section>
</template>

<script setup>
definePageMeta({ layout: "modules" });

import { ref } from "vue";
import { useSettingsStore } from "../../../stores/settings.ts";

const settings = useSettingsStore();
const slider = ref(settings.background === "white" ? 100 : 0);

const updateBackground = () => {
  try {
    settings.setBackground(
      slider.value > 80 ? "white" : slider.value >= 50 ? "gray" : "#24947"
    );
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};
</script>
