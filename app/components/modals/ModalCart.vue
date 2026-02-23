<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useSettingsStore } from "../../../stores/settings";
import type { Product } from "../../types/modal";

const props = defineProps<{
  open: boolean;
  product: Product | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const settings = useSettingsStore();
const qty = ref(1);

watch(
  () => props.open,
  (v) => {
    if (v) qty.value = 1;
  },
);

const total = computed(() => {
  if (!props.product) return 0;
  return props.product.price * qty.value;
});

const ratingFilled = computed(() => {
  const r = props.product?.rating?.rate ?? 0;
  return Math.round(r);
});

function close() {
  emit("close");
}

function confirm() {
  if (!props.product) return;
  settings.addToCart(props.product, qty.value);
  emit("close");
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") close();
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[80]">
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/55" @click="close" />

        <!-- wrapper -->
        <div class="relative grid min-h-full place-items-center p-4">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
          >
            <div
              v-if="open"
              class="w-full max-w-xl overflow-hidden rounded-2xl bg-[#2b2b2b] shadow-2xl ring-1 ring-white/10"
              role="dialog"
              aria-modal="true"
            >
              <!-- top bar -->
              <div
                class="flex items-start justify-between gap-4 border-b border-white/10 p-5"
              >
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-white/90">Add to cart</p>
                  <p class="mt-0.5 text-xs text-white/50">
                    Review the item and choose quantity.
                  </p>
                </div>

                <button
                  class="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
                  @click="close"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <!-- content -->
              <div v-if="product" class="flex flex-col max-h-[70vh] p-5">
                <div class="grid gap-5 md:grid-cols-[180px_1fr] overflow-y-auto md:items-start min-h-0 overflow-y-auto">
                  <!-- image -->
                  <div class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <div class="grid place-items-center">
                      <img
                        :src="product.image"
                        :alt="product.title"
                        class="h-36 w-full object-contain md:h-44"
                        loading="lazy"
                      />
                    </div>

                    <div class="mt-3 flex items-center justify-between">
                      <span
                        class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
                      >
                        {{ product.category || "Item" }}
                      </span>

                      <span class="text-sm font-bold text-[var(--color-base)]">
                        ${{ product.price }}
                      </span>
                    </div>
                  </div>

                  <!-- details -->
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-white md:text-lg">
                      {{ product.title }}
                    </p>

                    <!-- rating -->
                    <div
                      v-if="product.rating"
                      class="mt-2 flex flex-wrap items-center gap-2"
                    >
                      <div class="flex items-center gap-0.5">
                        <span
                          v-for="i in 5"
                          :key="i"
                          class="text-sm"
                          :class="
                            i <= ratingFilled
                              ? 'text-[var(--color-base)]'
                              : 'text-white/20'
                          "
                        >
                          ★
                        </span>
                      </div>

                      <span class="text-xs text-white/60">
                        {{ product.rating.rate }} / 5
                      </span>

                      <span class="text-xs text-white/40">
                        ({{ product.rating.count }} reviews)
                      </span>
                    </div>

                    <p class="mt-3 text-sm text-white/60">
                      {{ product.description }}
                    </p>

                    <!-- qty + total -->
                    <div
                      class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <div>
                          <p class="text-sm font-medium text-white/80">
                            Quantity
                          </p>
                          <p class="text-xs text-white/50">
                            Total: ${{ total.toFixed(2) }}
                          </p>
                        </div>

                        <div class="flex items-center gap-2">
                          <button
                            class="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40"
                            :disabled="qty <= 1"
                            @click="qty--"
                          >
                            −
                          </button>

                          <input
                            v-model.number="qty"
                            type="number"
                            min="1"
                            class="h-9 w-16 rounded-xl border border-white/10 bg-white/10 text-center text-sm text-white outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                          />

                          <button
                            class="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            @click="qty++"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <!-- tiny hint -->
                      <p class="mt-3 text-xs text-white/45">
                        Press
                        <span class="rounded-md bg-white/10 px-1.5 py-0.5"
                          >Esc</span
                        >
                        to close.
                      </p>
                    </div>

                    <!-- actions -->
                    <div
                      class="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end"
                    >
                      <button
                        class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 sm:w-auto"
                        @click="close"
                      >
                        Cancel
                      </button>

                      <button
                        class="w-full rounded-xl bg-[var(--color-base)] px-4 py-2 text-sm font-bold text-black shadow-sm hover:brightness-110 sm:w-auto"
                        @click="confirm"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- footer (optional) -->
              <div
                class="border-t border-white/10 px-5 py-3 text-xs text-white/40"
              >
                This action will add the item to your cart.
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
