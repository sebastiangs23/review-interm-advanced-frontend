<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { useSettingsStore } from "../../../stores/settings";
import { storeToRefs } from "pinia";
import { ShoppingCartIcon, TrashIcon } from "@heroicons/vue/24/outline";

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const { $toast } = useNuxtApp();
const settings = useSettingsStore();

const items = computed(() => settings.cart);
const count = computed(() => settings.cartCount);
const total = computed(() => settings.cartTotal);

function close() {
  emit("close");
}

const checkOut = () => {
  $toast.info("Stripe checkout isn’t available yet (frontend-only demo).");
};

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === "Escape") close();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

function money(n: number) {
  return n.toFixed(2);
}
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
      <div v-if="open" class="fixed inset-0 z-[90]">
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/55" @click="close" />

        <!-- dialog -->
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
              class="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#2b2b2b] shadow-2xl ring-1 ring-white/10"
              role="dialog"
              aria-modal="true"
            >
              <!-- Header -->
              <div
                class="flex items-start justify-between gap-4 border-b border-white/10 p-5"
              >
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <ShoppingCartIcon class="h-5 w-5 text-white/80" />
                    <p class="text-sm font-semibold text-white/90">
                      Your cart
                      <span class="text-white/50">({{ count }})</span>
                    </p>
                  </div>
                  <p class="mt-0.5 text-xs text-white/50">
                    Review items, adjust quantities, or remove products.
                  </p>
                </div>

                <button
                  class="rounded-lg px-2 py-1 text-white/70 hover:bg-white/10 hover:text-white"
                  @click="close"
                  aria-label="Close cart"
                >
                  ✕
                </button>
              </div>

              <!-- Body -->
              <div class="p-5">
                <!-- Empty state -->
                <div
                  v-if="items.length === 0"
                  class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
                >
                  <p class="text-sm font-semibold text-white/80">
                    Your cart is empty
                  </p>
                  <p class="mt-1 text-xs text-white/50">
                    Add a product to see it here.
                  </p>
                </div>

                <!-- Items list -->
                <div v-else class="space-y-3 md:max-h-[20rem] max-h-[18rem] overflow-y-auto pr-1">
                  <div
                    v-for="it in items"
                    :key="it.product.id"
                    class="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div
                      class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-white/10 p-2"
                    >
                      <img
                        :src="it.product.image"
                        :alt="it.product.title"
                        class="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-semibold text-white">
                        {{ it.product.title }}
                      </p>

                      <div class="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          class="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
                        >
                          {{ it.product.category || "Item" }}
                        </span>
                        <span
                          class="text-sm font-bold text-[var(--color-base)]"
                        >
                          ${{ money(it.product.price) }}
                        </span>
                        <span class="text-xs text-white/40">
                          • Item total: ${{ money(it.product.price * it.qty) }}
                        </span>
                      </div>

                      <!-- Controls -->
                      <div
                        class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div class="flex items-center gap-2">
                          <button
                            class="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            @click="settings.decrement(it.product.id)"
                          >
                            −
                          </button>

                          <span
                            class="min-w-[40px] text-center text-sm font-semibold text-white/80"
                          >
                            {{ it.qty }}
                          </span>

                          <button
                            class="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                            @click="settings.increment(it.product.id)"
                          >
                            +
                          </button>
                        </div>

                        <button
                          class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                          @click="settings.removeFromCart(it.product.id)"
                        >
                          <TrashIcon class="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="border-t border-white/10 p-5">
                <div
                  class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p class="text-sm font-semibold text-white/80">
                      Subtotal:
                      <span class="text-[var(--color-base)]"
                        >${{ money(total) }}</span
                      >
                    </p>
                    <p class="text-xs text-white/45">
                      Taxes/shipping calculated at checkout.
                    </p>
                  </div>

                  <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <button
                      class="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 sm:w-auto"
                      @click="settings.clearCart()"
                      :disabled="items.length === 0"
                      :class="
                        items.length === 0
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                      "
                    >
                      Clear cart
                    </button>

                    <button
                      @click="checkOut()"
                      class="w-full rounded-xl bg-[var(--color-base)] px-4 py-2 text-sm font-bold text-black shadow-sm hover:brightness-110 sm:w-auto"
                      :disabled="items.length === 0"
                      :class="
                        items.length === 0
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                      "
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
