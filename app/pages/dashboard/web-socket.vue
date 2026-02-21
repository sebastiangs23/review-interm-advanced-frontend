<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Title from "../../components/Title.vue";
import type { Component } from "vue";
import {
  SignalIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/vue/24/outline";

import bitcoin from "../../assets/bitcoin.png";
import etherium from "../../assets/eth.png";
import solana from "../../assets/sol.png";

definePageMeta({ layout: "modules" });

type WsStatus = "connecting" | "connected" | "disconnected" | "error";
type Trend = "up" | "down" | "flat" | null;

type TradeMessage = {
  p: string; // price
};

type StatusUI = {
  text: string;
  cls: string;
  icon: Component;
};

// Prices (strings because you use toFixed)
const priceBtc = ref<string | null>(null);
const priceEth = ref<string | null>(null);
const priceSol = ref<string | null>(null);

const lastBtc = ref<number | null>(null);
const lastEth = ref<number | null>(null);
const lastSol = ref<number | null>(null);

const statusBtc = ref<WsStatus>("connecting");
const statusEth = ref<WsStatus>("connecting");
const statusSol = ref<WsStatus>("connecting");

const flashBtc = ref<boolean>(false);
const flashEth = ref<boolean>(false);
const flashSol = ref<boolean>(false);

// ✅ 3 sockets (no overwriting)
let btcSocket: WebSocket | null = null;
let ethSocket: WebSocket | null = null;
let solSocket: WebSocket | null = null;

function flash(flag: { value: boolean }) {
  flag.value = true;
  window.setTimeout(() => (flag.value = false), 180);
}

function connect(params: {
  symbol: string; // e.g. btcusdt
  socketRef: {
    get: () => WebSocket | null;
    set: (ws: WebSocket | null) => void;
  };
  status: { value: WsStatus };
  price: { value: string | null };
  last: { value: number | null };
  flashFlag: { value: boolean };
}) {
  const { symbol, socketRef, status, price, last, flashFlag } = params;

  // close previous socket if any
  socketRef.get()?.close();

  status.value = "connecting";

  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
  socketRef.set(ws);

  ws.onopen = () => {
    status.value = "connected";
  };

  ws.onmessage = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as TradeMessage;
    const next = Number.parseFloat(data.p);

    last.value = price.value ? Number(price.value) : next;
    price.value = next.toFixed(2);

    flash(flashFlag);
  };

  ws.onerror = () => {
    status.value = "error";
  };

  ws.onclose = () => {
    status.value = "disconnected";
  };
}

const reconnectBtc = () =>
  connect({
    symbol: "btcusdt",
    socketRef: { get: () => btcSocket, set: (ws) => (btcSocket = ws) },
    status: statusBtc,
    price: priceBtc,
    last: lastBtc,
    flashFlag: flashBtc,
  });

const reconnectEth = () =>
  connect({
    symbol: "ethusdt",
    socketRef: { get: () => ethSocket, set: (ws) => (ethSocket = ws) },
    status: statusEth,
    price: priceEth,
    last: lastEth,
    flashFlag: flashEth,
  });

const reconnectSol = () =>
  connect({
    symbol: "solusdt",
    socketRef: { get: () => solSocket, set: (ws) => (solSocket = ws) },
    status: statusSol,
    price: priceSol,
    last: lastSol,
    flashFlag: flashSol,
  });

function statusUi(status: WsStatus): StatusUI {
  if (status === "connected")
    return {
      text: "Connected",
      cls: "text-green-300 bg-green-500/10 border-green-500/20",
      icon: SignalIcon,
    };
  if (status === "connecting")
    return {
      text: "Connecting",
      cls: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
      icon: ArrowPathIcon,
    };
  if (status === "error")
    return {
      text: "Error",
      cls: "text-red-300 bg-red-500/10 border-red-500/20",
      icon: ExclamationTriangleIcon,
    };
  return {
    text: "Disconnected",
    cls: "text-gray-300 bg-white/5 border-white/10",
    icon: ExclamationTriangleIcon,
  };
}

function trend(price: string | null, last: number | null): Trend {
  if (!price || last == null) return null;
  const p = Number(price);
  if (p > last) return "up";
  if (p < last) return "down";
  return "flat";
}

onMounted(() => {
  reconnectBtc();
  reconnectEth();
  reconnectSol();
});

onUnmounted(() => {
  btcSocket?.close();
  ethSocket?.close();
  solSocket?.close();
});
</script>

<template>
  <section
    class="rounded-2xl border border-black/30 bg-[var(--input-bg-color)] p-4 sm:p-6"
  >
    <!-- Header (responsive) -->
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-3">
        <span class="relative flex h-3 w-3">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-base)] opacity-75"
          />
          <span
            class="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-base)]"
          />
        </span>

        <div>
          <Title text="WebSocket — Binance Live Prices" :size="1" />
          <p class="mt-1 text-xs text-white/50">
            Real-time trades stream (USDT pairs)
          </p>
        </div>
      </div>

      <div class="text-xs text-white/50">
        Tip: click <span class="text-white/70">Reconnect</span> if a stream drops.
      </div>
    </div>

    <!-- Cards (responsive: 1 col mobile, 3 cols desktop) -->
    <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <!-- BTC -->
      <div
        class="rounded-2xl border border-black/30 bg-[var(--bg-color-third)] p-5"
      >
        <!-- ✅ FIXED HEADER (no overlap on small widths) -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-[180px] items-center gap-3">
            <img
              :src="bitcoin"
              alt="Bitcoin"
              class="h-10 w-10 object-contain"
            />
            <div>
              <p class="text-sm text-white/70 whitespace-nowrap">
                BTC / USDT
              </p>
              <p class="text-xs text-white/40">Bitcoin</p>
            </div>
          </div>

          <div class="ml-auto flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.7rem]"
              :class="statusUi(statusBtc).cls"
            >
              <component :is="statusUi(statusBtc).icon" class="h-4 w-4" />
              {{ statusUi(statusBtc).text }}
            </span>

            <button
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] text-white/70 hover:bg-white/10"
              @click="reconnectBtc"
              type="button"
            >
              Reconnect
            </button>
          </div>
        </div>

        <div class="mt-5">
          <p class="text-xs text-white/40">Live price</p>

          <div class="mt-2 flex items-center gap-2">
            <p
              class="text-2xl font-bold font-mono text-[var(--color-base)] transition"
              :class="flashBtc ? 'scale-[1.02]' : ''"
            >
              {{ priceBtc ? `$${priceBtc}` : "Loading..." }}
            </p>

            <component
              v-if="trend(priceBtc, lastBtc) === 'up'"
              :is="ArrowTrendingUpIcon"
              class="h-5 w-5 text-green-300"
            />
            <component
              v-else-if="trend(priceBtc, lastBtc) === 'down'"
              :is="ArrowTrendingDownIcon"
              class="h-5 w-5 text-red-300"
            />
          </div>
        </div>
      </div>

      <!-- ETH -->
      <div
        class="rounded-2xl border border-black/30 bg-[var(--bg-color-third)] p-5"
      >
        <!-- ✅ FIXED HEADER -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-[180px] items-center gap-3">
            <img
              :src="etherium"
              alt="Ethereum"
              class="h-10 w-10 object-contain"
            />
            <div>
              <p class="text-sm text-white/70 whitespace-nowrap">
                ETH / USDT
              </p>
              <p class="text-xs text-white/40">Ethereum</p>
            </div>
          </div>

          <div class="ml-auto flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.7rem]"
              :class="statusUi(statusEth).cls"
            >
              <component :is="statusUi(statusEth).icon" class="h-4 w-4" />
              {{ statusUi(statusEth).text }}
            </span>

            <button
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] text-white/70 hover:bg-white/10"
              @click="reconnectEth"
              type="button"
            >
              Reconnect
            </button>
          </div>
        </div>

        <div class="mt-5">
          <p class="text-xs text-white/40">Live price</p>

          <div class="mt-2 flex items-center gap-2">
            <p
              class="text-2xl font-bold font-mono text-[var(--color-base)] transition"
              :class="flashEth ? 'scale-[1.02]' : ''"
            >
              {{ priceEth ? `$${priceEth}` : "Loading..." }}
            </p>

            <component
              v-if="trend(priceEth, lastEth) === 'up'"
              :is="ArrowTrendingUpIcon"
              class="h-5 w-5 text-green-300"
            />
            <component
              v-else-if="trend(priceEth, lastEth) === 'down'"
              :is="ArrowTrendingDownIcon"
              class="h-5 w-5 text-red-300"
            />
          </div>
        </div>
      </div>

      <!-- SOL -->
      <div
        class="rounded-2xl border border-black/30 bg-[var(--bg-color-third)] p-5"
      >
        <!-- ✅ FIXED HEADER -->
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-[180px] items-center gap-3">
            <img
              :src="solana"
              alt="Solana"
              class="h-10 w-10 object-contain"
            />
            <div>
              <p class="text-sm text-white/70 whitespace-nowrap">
                SOL / USDT
              </p>
              <p class="text-xs text-white/40">Solana</p>
            </div>
          </div>

          <div class="ml-auto flex flex-wrap items-center gap-2">
            <span
              class="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.7rem]"
              :class="statusUi(statusSol).cls"
            >
              <component :is="statusUi(statusSol).icon" class="h-4 w-4" />
              {{ statusUi(statusSol).text }}
            </span>

            <button
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] text-white/70 hover:bg-white/10"
              @click="reconnectSol"
              type="button"
            >
              Reconnect
            </button>
          </div>
        </div>

        <div class="mt-5">
          <p class="text-xs text-white/40">Live price</p>

          <div class="mt-2 flex items-center gap-2">
            <p
              class="text-2xl font-bold font-mono text-[var(--color-base)] transition"
              :class="flashSol ? 'scale-[1.02]' : ''"
            >
              {{ priceSol ? `$${priceSol}` : "Loading..." }}
            </p>

            <component
              v-if="trend(priceSol, lastSol) === 'up'"
              :is="ArrowTrendingUpIcon"
              class="h-5 w-5 text-green-300"
            />
            <component
              v-else-if="trend(priceSol, lastSol) === 'down'"
              :is="ArrowTrendingDownIcon"
              class="h-5 w-5 text-red-300"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>