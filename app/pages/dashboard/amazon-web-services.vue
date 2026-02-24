<script setup lang="ts">
import { ref, computed } from "vue";
import Title from "../../components/Title.vue";

definePageMeta({ layout: "modules" });

const imgSrc =
  "https://aws-frontend-demo-sg.s3.us-east-1.amazonaws.com/image.png";

const stageRef = ref<HTMLDivElement | null>(null);

const width = ref<number>(520); // px initial
const height = ref<number>(320); // px initial

// responsive limits
const minW = 180;
const minH = 120;

const isResizing = ref<boolean>(false);
let startX = 0;
let startY = 0;
let startW = 0;
let startH = 0;

const aspect = computed(() => (height.value ? width.value / height.value : 1));

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getMaxSize() {
  const stage = stageRef.value;
  if (!stage) return { maxW: 9999, maxH: 9999 };
  // keep some padding so it doesn't overflow
  const maxW = stage.clientWidth - 16;
  const maxH = Math.max(180, stage.clientHeight - 16);
  return { maxW, maxH };
}

function onHandleDown(e: PointerEvent) {
  isResizing.value = true;
  startX = e.clientX;
  startY = e.clientY;
  startW = width.value;
  startH = height.value;
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onHandleMove(e: PointerEvent) {
  if (!isResizing.value) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let nextW = startW + dx;
  let nextH = nextW / aspect.value;

  const { maxW, maxH } = getMaxSize();

  nextW = clamp(nextW, minW, maxW);
  nextH = clamp(nextH, minH, maxH);
  nextH = nextW / aspect.value;

  if (nextH > maxH) {
    nextH = maxH;
    nextW = nextH * aspect.value;
  }

  width.value = Math.round(nextW);
  height.value = Math.round(nextH);
}

function onHandleUp(e: PointerEvent) {
  isResizing.value = false;
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  } catch {}
}
</script>

<template>
  <div
    class="min-h-[calc(70vh-2rem)] bg-[var(--bg-color-secondary)] text-(--color-text-primary) md:p-4 p-2"
  >
    <Title text="Amazon Web Services" :size="1" />
    <p class="text-white/80 mb-4 md:text-2xl text-xs">
      This is where I will use the ec2 instance, s3, Aws Cognito etc.
    </p>

    <div
      ref="stageRef"
      class="mx-auto w-full max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div
        class="mb-2 flex items-center justify-between gap-2 text-xs text-white/60"
      >
        <div class="flex items-center md:gap-3 gap-2">
          <Title text="AWS S3" :size="4" />
          <span>Drag the corner to resize</span>
        </div>
        <span>{{ width }}×{{ height }}</span>
      </div>

      <div class="relative w-full overflow-hidden rounded-xl bg-black/10 p-3">
        <div
          class="relative"
          :style="{ width: width + 'px', height: height + 'px' }"
        >
          <img
            :src="imgSrc"
            alt="demo"
            class="h-full w-full rounded-lg object-contain select-none pointer-events-none"
            draggable="false"
          />

          <div
            class="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-[var(--color-base)]/60"
          ></div>

          <button
            type="button"
            class="absolute -bottom-2 -right-2 h-5 w-5 rounded-md border-2 border-[var(--color-dark)] bg-[var(--color-base)] shadow cursor-se-resize touch-none"
            @pointerdown="onHandleDown"
            @pointermove="onHandleMove"
            @pointerup="onHandleUp"
            @pointercancel="onHandleUp"
          >
            <span class="sr-only">Resize</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
