<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Title from "../../components/Title.vue"
import {
  SignalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

import bitcoin from "../../assets/bitcoin.png";
import etherium from "../../assets/eth.png";

definePageMeta({
  layout: "modules",
});

const priceBtc = ref(null);
const priceEth = ref(null);
const statusBtc = ref("connecting");
const statusEth = ref("connecting");
let socket = null;

function connectBtc() {
  statusBtc.value = "connecting";

  socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  socket.onopen = () => {
    statusBtc.value = "connected";
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    priceBtc.value = parseFloat(data.p).toFixed(2);
  };

  socket.onerror = () => {
    statusBtc.value = "error";
  };

  socket.onclose = () => {
    statusBtc.value = "disconnected";
  };
}

function connectEth(){
  statusEth.value = "connecting";

  socket = new WebSocket("wss://stream.binance.com:9443/ws/ethusdt@trade");

  socket.onopen = () => {
    statusEth.value = "connected";
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    priceEth.value = parseFloat(data.p).toFixed(2);
  };

  socket.onerror = () => {
    statusEth.value = "error";
  };

  socket.onclose = () => {
    statusEth.value = "disconnected";
  }
}

onMounted(() => {
  connectEth();
  connectBtc(); 
});

onUnmounted(() => {
  socket?.close();
});

const statusColor = computed(() => {
  if (statusBtc.value === "connected") return "text-green-400";
  if (statusBtc.value === "error") return "text-red-400";
  if (statusBtc.value === "connecting") return "text-yellow-400";
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
        <span class="relative flex h-3 w-3">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--color-base)]"
          ></span>

          <span
            class="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-base)]"
          ></span>
        </span>

        <Title text="WebSocket - Binance Live Price" :size=1 />
      </div>

      <!-- STATUS -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 text-sm"
      >
        <component
          :is="
            statusBtc === 'connected'
              ? SignalIcon
              : statusBtc === 'connecting'
                ? ArrowPathIcon
                : ExclamationTriangleIcon
          "
          class="w-4 h-4"
          :class="statusColor"
        />
        <span class="capitalize" :class="statusColor">
          {{ statusBtc }}
        </span>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row items-center gap-6 bg-[var(--bg-color-third)] border border-black/30 rounded-xl p-5"
    >
      <div class="flex-shrink-0">
        <img
          :src="bitcoin"
          alt="Bitcoin"
          class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
        />
      </div>

      <div class="flex-1 text-center sm:text-left space-y-2">
        <p class="text-gray-400 text-sm">Trading Pair</p>
        <p class="text-white font-semibold">BTC / USDT</p>

        <p class="text-gray-400 text-sm mt-4">Live Price</p>

        <p
          class="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-base)]"
        >
          {{ priceBtc ? `$${priceBtc}` : "Loading..." }}
        </p>
      </div>
    </div>

    <div
      class="flex flex-col sm:flex-row items-center gap-6 bg-[var(--bg-color-third)] border border-black/30 rounded-xl p-5"
    >
      <div class="flex-shrink-0">
        <img
          :src="etherium"
          alt="Bitcoin"
          class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
        />
      </div>

      <div class="flex-1 text-center sm:text-left space-y-2">
        <p class="text-gray-400 text-sm">Trading Pair</p>
        <p class="text-white font-semibold">ETH / USDT</p>

        <p class="text-gray-400 text-sm mt-4">Live Price</p>

        <p
          class="text-2xl sm:text-3xl font-mono font-bold text-[var(--color-base)]"
        >
          {{ priceEth ? `$${priceEth}` : "Loading..." }}
        </p>
      </div>
    </div>
  </section>
</template>
