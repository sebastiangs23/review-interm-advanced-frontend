<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Title from "../../components/Title.vue"
import {
  SignalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

import bitcoin from "../../assets/bitcoin.png";

definePageMeta({
  layout: "modules",
});

const price = ref(null);
const status = ref("connecting");
let socket = null;

function connect() {
  status.value = "connecting";

  socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  socket.onopen = () => {
    status.value = "connected";
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    price.value = parseFloat(data.p).toFixed(2);
  };

  socket.onerror = () => {
    status.value = "error";
  };

  socket.onclose = () => {
    status.value = "disconnected";
  };
}

onMounted(connect);

onUnmounted(() => {
  socket?.close();
});

const statusColor = computed(() => {
  if (status.value === "connected") return "text-green-400";
  if (status.value === "error") return "text-red-400";
  if (status.value === "connecting") return "text-yellow-400";
  return "text-gray-400";
});
</script>

<template>
  <section
    class="bg-[var(--input-bg-color)] border border-black/30 rounded-xl p-4 sm:p-6 space-y-6"
  >
    <!-- HEADER -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <!-- Blinking Live Dot -->
        <span class="relative flex h-3 w-3">
          <!-- Ping animation -->
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--color-base)]"
          ></span>

          <!-- Solid dot -->
          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-base)]"
          ></span>
        </span>

        <!-- MAKE THE WIDTH DYNAMIC IN TITLE AND USE IT BELOW -->
        <h1
          class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2"
        >
          WebSocket - Binance Live Price
        </h1>
        <!-- <Title text="WebSocket - Binance Live Price" :size=1 /> -->
      </div>

      <!-- STATUS -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 text-sm"
      >
        <component
          :is="
            status === 'connected'
              ? SignalIcon
              : status === 'connecting'
                ? ArrowPathIcon
                : ExclamationTriangleIcon
          "
          class="w-4 h-4"
          :class="statusColor"
        />
        <span class="capitalize" :class="statusColor">
          {{ status }}
        </span>
      </div>
    </div>

    <!-- CONTENT CARD -->
    <div
      class="flex flex-col sm:flex-row items-center gap-6 bg-[var(--bg-color-third)] border border-black/30 rounded-xl p-5"
    >
      <!-- BTC IMAGE -->
      <div class="flex-shrink-0">
        <img
          :src="bitcoin"
          alt="Bitcoin"
          class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
        />
      </div>

      <!-- PRICE INFO -->
      <div class="flex-1 text-center sm:text-left space-y-2">
        <p class="text-gray-400 text-sm">Trading Pair</p>
        <p class="text-white font-semibold">BTC / USDT</p>

        <p class="text-gray-400 text-sm mt-4">Live Price</p>

        <p
          class="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-base)]"
        >
          {{ price ? `$${price}` : "Loading..." }}
        </p>
      </div>
    </div>
  </section>
</template>
