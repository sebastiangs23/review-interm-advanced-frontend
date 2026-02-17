<script setup lang="ts">
definePageMeta({ layout: "modules" });

import { ref } from "vue";
import Title from "../../components/Title.vue"
import ColorPalette from "../../components/ColorPalette.vue";

const label = ref<string>("Background");
const color = ref<string>("#ffffff");
const showHex = ref<boolean>(true);
</script>

<template>
  <section class="min-h-[calc(100vh-2rem)] bg-[var(--bg-color-secondary)] p-6">
    <Title text="Component Catalog" :size=1 />
    <div class="mx-auto w-full max-w-4xl mt-2">
      <!-- Card -->
      <div
        class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8"
      >
        <div class="mb-6">
          <h2
            class="text-xl font-semibold text-[var(--color-base)] md:text-2xl"
          >
            Color Palette Component
          </h2>
          <p class="mt-1 text-sm text-white/60">
            Customize the props and preview the component in real time.
          </p>
        </div>

        <!-- Layout -->
        <div class="grid gap-6 md:grid-cols-[340px_1px_1fr] md:gap-8">
          <!-- Left: Controls -->
          <div class="space-y-5">
            <!-- Label -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white/80">Label</label>
              <input
                type="text"
                v-model="label"
                class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black placeholder-black/40 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="e.g. Background"
              />
            </div>

            <!-- Toggle: Show Hex -->
            <div
              class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div>
                <p class="text-sm font-medium text-white/80">Show Hex</p>
                <p class="text-xs text-white/50">
                  Display hex code under the label.
                </p>
              </div>

              <button
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition"
                :class="showHex ? 'bg-[var(--color-base)]' : 'bg-white/20'"
                @click="showHex = !showHex"
                :aria-pressed="showHex"
              >
                <span
                  class="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition"
                  :class="showHex ? 'translate-x-5' : 'translate-x-1'"
                />
              </button>
            </div>

            <!-- Color -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white/80">Color</label>

              <div class="flex items-center gap-3">
                <!-- Native color input (styled wrapper) -->
                <label
                  class="flex h-10 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/90 shadow-sm"
                  title="Pick a color"
                >
                  <input
                    type="color"
                    v-model="color"
                    class="h-12 w-14 cursor-pointer border-0 bg-transparent p-0"
                    style="appearance: none"
                  />
                </label>

                <!-- Hex input (optional but improves UX a lot) -->
                <input
                  type="text"
                  v-model="color"
                  class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  placeholder="#ffffff"
                />
              </div>

              <p class="text-xs text-white/50">
                Tip: you can paste a hex code directly.
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div class="hidden bg-white/10 md:block"></div>

          <!-- Right: Preview -->
          <div class="flex items-center justify-center">
            <div
              class="w-full rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-medium text-white/70">Preview</p>

                <div class="flex items-center justify-center gap-2">
                  <span class="relative flex h-2 w-2">
                    <span
                      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-base)] opacity-75"
                    ></span>
                    <span
                      class="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-base)]"
                    ></span>
                  </span>

                  <span class="text-xs text-white/40 leading-none">Live</span>
                </div>
              </div>

              <div class="grid place-items-center rounded-xl bg-black/10 p-6">
                <ColorPalette
                  :label="label"
                  :color="color"
                  :showHex="showHex"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
