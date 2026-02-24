<script setup lang="ts">
//TODO: Refactor and componentize this page
definePageMeta({ layout: "modules" });

import { ref, computed, reactive } from "vue";
import Title from "../../components/Title.vue";
import ColorPalette from "../../components/ColorPalette.vue";
import Badge from "../../components/Badge.vue";
import Loader from "../../components/Loader.vue";

const label = ref<string>("Background");
const color = ref<string>("#ffffff");
const showHex = ref<boolean>(true);

const textText = ref<string>("Hello world");
const sizeText = ref<number>(1);

const textBadge = ref<string>("Hello world");
const colorTextBadge = ref<string>("#ffffff");
const classBadge = ref<string>("bg-blue-500");
const showToolTipBadge = ref<boolean>(true);

const showLoader = ref<boolean>(true);
const textLoader = ref<string>("Loading");
const subtextLoader = ref<string>("Up to youuu");
const blurLoader = ref<boolean>(true);
const blockLoader = ref<boolean>(false);

const pagination = reactive({ page: 1, perPage: 1 });

const sections = computed(() => ["color", "title", "badge", "loader"]);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sections.value.length / pagination.perPage)),
);

const paginatedSections = computed(() => {
  const start = (pagination.page - 1) * pagination.perPage;
  return sections.value.slice(start, start + pagination.perPage);
});

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, i) => i + 1),
);

function goToPage(p: number) {
  pagination.page = Math.min(Math.max(1, p), totalPages.value);
}
function prevPage() {
  goToPage(pagination.page - 1);
}
function nextPage() {
  goToPage(pagination.page + 1);
}
</script>

<template>
  <section class="min-h-[calc(70vh-2rem)] bg-[var(--bg-color-secondary)] p-6">
    <Title text="Component Catalog" :size="1" />
    <div class="mx-auto w-full max-w-4xl">
      <!-- Color Palette -->
      <div
        v-if="paginatedSections.includes('color')"
        class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8 md:my-4"
      >
        <div class="mb-6">
          <h2
            class="md:text-xl text-lg font-semibold text-[var(--color-base)] md:text-2xl"
          >
            Color Palette Component
          </h2>
        </div>

        <!-- Layout -->
        <div
          class="grid md:grid-cols-[340px_1px_1fr] grid-cols-[230px] md:gap-8 gap-6"
        >
          <!-- Left: Controls -->
          <div class="space-y-5">
            <!-- Label -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-white/80">Label</label>
              <input
                type="text"
                v-model="label"
                maxlength="20"
                class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black placeholder-black/40 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                placeholder="e.g. Background"
              />
            </div>

            <!-- Toggle: Show Hex -->
            <div
              class="flex items-center justify-between md:gap-4 gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div>
                <p class="text-sm font-medium text-white/80">Show Hex</p>
                <p class="md:text-xs text-[0.6rem] text-white/50">
                  Display hex code under the label.
                </p>
              </div>

              <button
                type="button"
                class="relative inline-flex md:h-6 h-5 md:w-11 w-10 items-center rounded-full transition"
                :class="showHex ? 'bg-[var(--color-base)]' : 'bg-white/20'"
                @click="showHex = !showHex"
                :aria-pressed="showHex"
              >
                <span
                  class="inline-block md:h-5 md:w-5 h-4 w-4 rounded-full bg-white shadow-sm transition"
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
                    maxlength="20"
                    class="h-12 w-14 cursor-pointer border-0 bg-transparent p-0"
                    style="appearance: none"
                  />
                </label>

                <!-- Hex input (optional but improves UX a lot) -->
                <input
                  type="text"
                  v-model="color"
                  maxlength="20"
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

      <!-- Title -->
      <div
        v-if="paginatedSections.includes('title')"
        class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8 md:my-4"
      >
        <div class="mb-6">
          <h2
            class="md:text-xl text-lg font-semibold text-[var(--color-base)] md:text-2xl"
          >
            Title Component
          </h2>

          <!-- Layout Title -->
          <div
            class="grid md:grid-cols-[340px_1px_1fr] grid-cols-[230px] md:gap-8 gap-6"
          >
            <!-- Left: Controls -->
            <div class="space-y-5">
              <!-- Label -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80">Text</label>
                <input
                  type="text"
                  v-model="textText"
                  maxlength="20"
                  class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black placeholder-black/40 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  placeholder="e.g. Hello World"
                />
              </div>

              <!-- Color -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80">Size</label>

                <div class="flex items-center gap-3">
                  <input
                    type="number"
                    v-model="sizeText"
                    min="1"
                    max="4"
                    class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    placeholder="Only 1..4 for sizes"
                  />
                </div>

                <p class="text-xs text-white/50">
                  Tip: Only 1,2,3,4 are valid sizes.
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

                    <span class="text-xs text-white/40 leading-none">{{
                      Live
                    }}</span>
                  </div>
                </div>

                <div class="grid place-items-center rounded-xl bg-black/10 p-6">
                  <Title :text="textText" :size="sizeText" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Badge -->
      <div
        v-if="paginatedSections.includes('badge')"
        class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8 md:my-4"
      >
        <div class="mb-6">
          <h2
            class="md:text-xl text-lg font-semibold text-[var(--color-base)] md:text-2xl"
          >
            Badge Component
          </h2>

          <!-- Layout Badge -->
          <div
            class="grid md:grid-cols-[340px_1px_1fr] grid-cols-[230px] md:gap-8 gap-6"
          >
            <!-- Left: Controls -->
            <div class="space-y-5">
              <!-- Label -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80">Text</label>
                <input
                  type="text"
                  v-model="textBadge"
                  maxlength="20"
                  class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black placeholder-black/40 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  placeholder="e.g. Hello World"
                />
              </div>

              <!-- Color -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80"
                  >Text Color</label
                >

                <div class="flex items-center gap-3">
                  <input
                    type="text"
                    v-model="colorTextBadge"
                    maxlength="20"
                    class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    placeholder="Text Color"
                  />
                </div>

                <p class="text-xs text-white/50">Only #Hex</p>
              </div>

              <!-- Toggle: Show Hex -->
              <div
                class="flex items-center justify-between md:gap-4 gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p class="text-sm font-medium text-white/80">Show tooltip</p>
                  <p class="md:text-xs text-[0.6rem] text-white/50">
                    Display tooltip on hover.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative inline-flex md:h-6 h-5 md:w-11 w-10 items-center rounded-full transition"
                  :class="
                    showToolTipBadge ? 'bg-[var(--color-base)]' : 'bg-white/20'
                  "
                  @click="showToolTipBadge = !showToolTipBadge"
                  :aria-pressed="showToolTipBadge"
                >
                  <span
                    class="inline-block md:h-5 md:w-5 h-4 w-4 rounded-full bg-white shadow-sm transition"
                    :class="
                      showToolTipBadge ? 'translate-x-5' : 'translate-x-1'
                    "
                  />
                </button>
              </div>

              <!-- Class -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80"
                  >Customize Class</label
                >

                <div class="flex items-center gap-3">
                  <input
                    type="text"
                    v-model="classBadge"
                    class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    placeholder="Custom Class"
                  />
                </div>

                <p class="text-xs text-white/50">
                  Tip: Only support tailwind Classes
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

                    <span class="text-xs text-white/40 leading-none">{{
                      Live
                    }}</span>
                  </div>
                </div>

                <div class="grid place-items-center rounded-xl bg-black/10 p-6">
                  <Badge
                    :text="textBadge"
                    :colorText="colorTextBadge"
                    :toolTipActive="showToolTipBadge"
                    :class="classBadge"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loader -->
      <div
        v-if="paginatedSections.includes('loader')"
        class="rounded-2xl bg-[var(--bg-color-primary)] p-6 shadow-sm ring-1 ring-black/5 md:p-8 md:my-4"
      >
        <div class="mb-6">
          <h2
            class="md:text-xl text-lg font-semibold text-[var(--color-base)] md:text-2xl"
          >
            Loader Component
          </h2>

          <!-- Layout Badge -->
          <div
            class="grid md:grid-cols-[340px_1px_1fr] grid-cols-[230px] md:gap-8 gap-6"
          >
            <!-- Left: Controls -->
            <div class="space-y-5">
              <!-- Toggle: Active -->
              <div
                class="flex items-center justify-between md:gap-4 gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p class="text-sm font-medium text-white/80">Show Loader</p>
                  <p class="md:text-xs text-[0.6rem] text-white/50">
                    Display loader.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative inline-flex md:h-6 h-5 md:w-11 w-10 items-center rounded-full transition"
                  :class="showLoader ? 'bg-[var(--color-base)]' : 'bg-white/20'"
                  @click="showLoader = !showLoader"
                  :aria-pressed="showLoader"
                >
                  <span
                    class="inline-block md:h-5 md:w-5 h-4 w-4 rounded-full bg-white shadow-sm transition"
                    :class="showLoader ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
              </div>

              <!-- Text -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80">Text</label>
                <input
                  type="text"
                  v-model="textLoader"
                  class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black placeholder-black/40 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                  placeholder="e.g. Hello World"
                />
              </div>

              <!-- SubText -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/80">Subtext</label>

                <div class="flex items-center gap-3">
                  <input
                    type="text"
                    v-model="subtextLoader"
                    class="h-10 w-full rounded-xl border border-white/10 bg-white/90 px-3 text-sm text-black shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    placeholder="Subtext"
                  />
                </div>

                <p class="text-xs text-white/50">Only #Hex</p>
              </div>

              <!-- Toggle: Blur -->
              <div
                class="flex items-center justify-between md:gap-4 gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p class="text-sm font-medium text-white/80">Blur</p>
                  <p class="md:text-xs text-[0.6rem] text-white/50">
                    Boolean to remove the blur.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative inline-flex md:h-6 h-5 md:w-11 w-10 items-center rounded-full transition"
                  :class="blurLoader ? 'bg-[var(--color-base)]' : 'bg-white/20'"
                  @click="blurLoader = !blurLoader"
                  :aria-pressed="blurLoader"
                >
                  <span
                    class="inline-block md:h-5 md:w-5 h-4 w-4 rounded-full bg-white shadow-sm transition"
                    :class="blurLoader ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
              </div>

              <!-- Toggle: Block -->
              <div
                class="flex items-center justify-between md:gap-4 gap-2 rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div>
                  <p class="text-sm font-medium text-white/80">Block</p>
                  <p class="md:text-xs text-[0.6rem] text-white/50">
                    The click pass through the overlay.
                  </p>
                </div>

                <button
                  type="button"
                  class="relative inline-flex md:h-6 h-5 md:w-11 w-10 items-center rounded-full transition"
                  :class="
                    blockLoader ? 'bg-[var(--color-base)]' : 'bg-white/20'
                  "
                  @click="blockLoader = !blockLoader"
                  :aria-pressed="blockLoader"
                >
                  <span
                    class="inline-block md:h-5 md:w-5 h-4 w-4 rounded-full bg-white shadow-sm transition"
                    :class="blockLoader ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
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

                    <span class="text-xs text-white/40 leading-none">{{
                      Live
                    }}</span>
                  </div>
                </div>

                <div
                  class="relative w-full overflow-hidden rounded-xl bg-black/10 p-6 min-h-[220px] sm:min-h-[260px] md:min-h-[320px]"
                >
                  <!-- contenido de muestra debajo del loader -->
                  <div class="grid h-full place-items-center">
                    <div class="w-full max-w-sm space-y-3">
                      <div class="h-10 w-2/3 rounded-lg bg-white/10"></div>
                      <div class="h-3 w-full rounded bg-white/10"></div>
                      <div class="h-3 w-5/6 rounded bg-white/10"></div>
                      <div class="h-10 w-32 rounded-xl bg-white/10"></div>
                    </div>
                  </div>

                  <!-- loader encima (no lo mueves, solo lo “anclas” aquí) -->
                  <Loader
                    :active="showLoader"
                    :text="textLoader"
                    :subtext="subtextLoader"
                    :blur="blurLoader"
                    :block="blockLoader"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-white"
    >
      <div class="text-sm font-semibold">
        Page <span class="font-bold">{{ pagination.page }}</span> of
        <span class="font-bold">{{ totalPages }}</span>
      </div>

      <div class="flex items-center gap-2 flex-wrap justify-center">
        <button
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="prevPage"
          :disabled="pagination.page === 1"
          :class="pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          type="button"
        >
          Prev
        </button>

        <button
          v-for="p in pageNumbers"
          :key="`page-${p}`"
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="goToPage(p)"
          :class="p === pagination.page ? 'bg-[var(--color-base)]' : ''"
          type="button"
        >
          {{ p }}
        </button>

        <button
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="nextPage"
          :disabled="pagination.page === totalPages"
          :class="
            pagination.page === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : ''
          "
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  </section>
</template>
