<script setup>
definePageMeta({ layout: "modules" });

import { ref } from "vue";
import ColorPalette from "../../components/ColorPalette.vue";

const label = ref("Background");
const color = ref("#ffffff");
const showHex = ref(true);
</script>

<template>
  <section class="my-components">
    <div class="card">
      
      <div class="card__controls">
        <h2 class="title">Color Palette Component</h2>

        <div class="field">
          <label>Label</label>
          <input type="text" v-model="label" />
        </div>

        <div class="field switch-field">
          <label>Show Hex</label>
          <label class="switch">
            <input type="checkbox" v-model="showHex" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="field">
          <label>Color</label>
          <input type="color" v-model="color" />
        </div>
      </div>

      <div class="card__divider"></div>

      <div class="card__preview">
        <ColorPalette
          :label="label"
          :color="color"
          :showHex="showHex"
        />
      </div>

    </div>
  </section>
</template>

<style scoped>
.my-components {
  background: #f4f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.card {
  display: flex;
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  gap: 32px;
}

.card__controls {
  flex: 1;
  max-width: 320px;
}

.card__divider {
  width: 1px;
  background-color: #e5e7eb;
}

.card__preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1f2937;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}

.field input[type="text"],
.field input[type="color"] {
  height: 40px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0 12px;
  font-size: 14px;
  background: #fff;
}

.field input[type="text"]:focus {
  outline: none;
  border-color: #2563eb;
}

.switch-field {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  background-color: #d1d5db;
  border-radius: 999px;
  transition: background-color 0.25s;
}

.slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  top: 3px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: transform 0.25s;
}

.switch input:checked + .slider {
  background-color: #2563eb;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
