<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import Title from "../../components/Title.vue";

definePageMeta({ layout: "modules" });

type Algo = "bubble" | "quick" | "selection";
type Order = "asc" | "desc";

const algos: Array<{ key: Algo; label: string }> = [
  { key: "bubble", label: "Bubble" },
  { key: "quick", label: "Quick" },
  { key: "selection", label: "Selection" },
];

const algo = ref<Algo>("bubble");
const order = ref<Order>("asc");

const isSorting = ref(false);
const bars = ref<number[]>([]);
const active = ref<{ i?: number; j?: number; pivot?: number }>({});

const stageRef = ref<HTMLDivElement | null>(null);

// responsive bar count
const barCount = ref(32);
let ro: ResizeObserver | null = null;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle() {
  const n = barCount.value;
  const arr = Array.from({ length: n }, () => randInt(10, 100));
  bars.value = arr;
  active.value = {};
}

function setBarCountFromWidth() {
  const w = stageRef.value?.clientWidth ?? 900;
  // mobile fewer bars, desktop more bars
  const next =
    w < 420 ? 18 : w < 640 ? 24 : w < 900 ? 32 : w < 1100 ? 44 : 56;
  if (barCount.value !== next) {
    barCount.value = next;
    shuffle();
  }
}

onMounted(() => {
  setBarCountFromWidth();
  ro = new ResizeObserver(setBarCountFromWidth);
  if (stageRef.value) ro.observe(stageRef.value);
});

onBeforeUnmount(() => ro?.disconnect());

// --- animation engine ---
type Step =
  | { t: "cmp"; i: number; j: number; pivot?: number }
  | { t: "swap"; i: number; j: number; pivot?: number }
  | { t: "pivot"; pivot: number };

function swap(arr: number[], i: number, j: number) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

function dirCmp(a: number, b: number) {
  return order.value === "asc" ? a - b : b - a;
}

// Generate steps (pure, based on snapshot)
function bubbleSteps(input: number[]) {
  const arr = [...input];
  const steps: Step[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      steps.push({ t: "cmp", i: j, j: j + 1 });
      if (dirCmp(arr[j], arr[j + 1]) > 0) {
        steps.push({ t: "swap", i: j, j: j + 1 });
        swap(arr, j, j + 1);
      }
    }
  }
  return steps;
}

function selectionSteps(input: number[]) {
  const arr = [...input];
  const steps: Step[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    let best = i;
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({ t: "cmp", i: best, j });
      if (dirCmp(arr[best], arr[j]) > 0) {
        best = j;
      }
    }
    if (best !== i) {
      steps.push({ t: "swap", i, j: best });
      swap(arr, i, best);
    }
  }
  return steps;
}

function quickSteps(input: number[]) {
  const arr = [...input];
  const steps: Step[] = [];

  function partition(lo: number, hi: number) {
    const pivot = hi;
    steps.push({ t: "pivot", pivot });

    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ t: "cmp", i: j, j: pivot, pivot });
      if (dirCmp(arr[j], arr[pivot]) < 0) {
        if (i !== j) {
          steps.push({ t: "swap", i, j, pivot });
          swap(arr, i, j);
        }
        i++;
      }
    }
    if (i !== pivot) {
      steps.push({ t: "swap", i, j: pivot, pivot });
      swap(arr, i, pivot);
    }
    return i;
  }

  function qs(lo: number, hi: number) {
    if (lo >= hi) return;
    const p = partition(lo, hi);
    qs(lo, p - 1);
    qs(p + 1, hi);
  }

  qs(0, arr.length - 1);
  return steps;
}

function makeSteps(input: number[]) {
  if (algo.value === "bubble") return bubbleSteps(input);
  if (algo.value === "selection") return selectionSteps(input);
  return quickSteps(input);
}

// Run steps in ~3.5s
let timer: number | null = null;

function clearTimer() {
  if (timer) window.clearInterval(timer);
  timer = null;
}

function applyStep(step: Step) {
  if (step.t === "pivot") {
    active.value = { pivot: step.pivot };
    return;
  }

  active.value = { i: step.i, j: step.j, pivot: step.pivot };

  if (step.t === "swap") {
    const arr = [...bars.value];
    swap(arr, step.i, step.j);
    bars.value = arr;
  }
}

function sortNow() {
  if (isSorting.value) return;

  isSorting.value = true;
  active.value = {};

  const steps = makeSteps(bars.value);
  if (steps.length === 0) {
    isSorting.value = false;
    return;
  }

  const totalMs = 3500; // ~3.5s
  const interval = Math.max(10, Math.floor(totalMs / steps.length));

  let k = 0;
  clearTimer();
  timer = window.setInterval(() => {
    applyStep(steps[k]);
    k++;

    if (k >= steps.length) {
      clearTimer();
      active.value = {};
      isSorting.value = false;
    }
  }, interval);
}

onBeforeUnmount(clearTimer);

// init
if (bars.value.length === 0) shuffle();
</script>

<template>
  <Title text="Dashboard" :size="1" />

  <div
    class="rounded-2xl border border-zinc-200 bg-[var(--bg-color-primary)] p-4 shadow-sm md:mt-2 mt-1"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-xl font-semibold text-white py-2">Sorting Visualizer</h3>
        <p class="text-xs text-zinc-500">
          Pick an algorithm and watch the bars sort ({{ order.toUpperCase() }}) in ~3–4s.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
        <!-- Segmented toggle -->
        <div class="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1">
          <button
            v-for="t in algos"
            :key="t.key"
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            :disabled="isSorting"
            :class="
              algo === t.key
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
            "
            @click="algo = t.key"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- order toggle -->
        <div class="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1">
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            :disabled="isSorting"
            :class="order === 'asc' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-700 hover:bg-white'"
            @click="order = 'asc'"
          >
            Asc
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
            :disabled="isSorting"
            :class="order === 'desc' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-700 hover:bg-white'"
            @click="order = 'desc'"
          >
            Desc
          </button>
        </div>

        <button
          type="button"
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          :disabled="isSorting"
          :class="isSorting ? 'opacity-50 cursor-not-allowed' : ''"
          @click="shuffle"
        >
          Shuffle
        </button>

        <button
          type="button"
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          :disabled="isSorting"
          :class="isSorting ? 'opacity-50 cursor-not-allowed' : ''"
          @click="sortNow"
        >
          {{ isSorting ? "Sorting..." : "Sort" }}
        </button>
      </div>
    </div>

    <!-- Bars (responsive) -->
    <div ref="stageRef" class="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3">
      <div
        class="flex items-end gap-[2px] sm:gap-1 h-[220px] sm:h-[280px] md:h-[320px] w-full"
      >
        <div
          v-for="(v, idx) in bars"
          :key="idx"
          class="flex-1 rounded-t-md transition-[height] duration-75 ease-linear"
          :class="[
            idx === active.pivot ? 'bg-yellow-300/90' :
            idx === active.i || idx === active.j ? 'bg-white/90' :
            'bg-[var(--color-base)]/90'
          ]"
          :style="{ height: `${v}%` }"
          title="value"
        />
      </div>

      <div class="mt-2 flex items-center justify-between text-xs text-white/50">
        <span>Bars: {{ bars.length }}</span>
        <span v-if="isSorting">Comparing & swapping…</span>
        <span v-else>Ready</span>
      </div>
    </div>
  </div>
</template>