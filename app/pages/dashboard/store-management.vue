<script setup>
definePageMeta({ layout: "modules" });

import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../../stores/settings";
import Title from "../../components/Title.vue";
import ColorPalette from "../../components/ColorPalette.vue";

const settings = useSettingsStore();
const { colorPalette, colorButtons } = storeToRefs(settings);

const config = [
  { label: "Modules", model: colorPalette },
  { label: "Buttons", model: colorButtons },
];

const updateColor = ({ label, color }) => {
  if (label === "Modules") settings.setColorPalette(color);
  if (label === "Buttons") settings.setColorButtons(color);
};
</script>

<template>
  <section class="min-h-[calc(100vh-2rem)] bg-[var(--bg-color-secondary)] p-6">
    <Title text="Store Management (Pinia)" :size="1" />

    <div class="mx-auto mt-2 w-full max-w-4xl">
      <div class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-[var(--color-base)] md:text-2xl">
            Theme Colors
          </h2>
          <p class="mt-1 text-xs text-white/60 md:text-sm">
            Update Pinia theme tokens in real time.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, index) in config"
            :key="index"
            class="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p class="mb-3 text-sm font-medium text-white/70">
              {{ item.label }}
            </p>

            <ColorPalette
              :label="item.label"
              :color="item.model"
              :showHex="true"
              @update:modelValue="updateColor($event)"
            />

            <p class="mt-2 text-[0.7rem] text-white/40">
              Updates the store token in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>