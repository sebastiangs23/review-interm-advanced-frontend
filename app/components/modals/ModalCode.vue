<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
  sourceCode: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const copied = ref(false);
const minimized = ref(false);
let copiedTimer: number | undefined;

watch(
  () => props.show,
  (v) => {
    if (!v) minimized.value = false;
  }
);

function close() {
  minimized.value = false;
  emit("close");
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.sourceCode);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = props.sourceCode;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  copied.value = true;
  clearTimeout(copiedTimer);
  copiedTimer = window.setTimeout(() => {
    copied.value = false;
  }, 1200);
}

function onKeydown(e: KeyboardEvent) {
  if (!props.show || minimized.value) return;
  if (e.key === "Escape") close();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

const isVisible = computed(() => props.show);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="cm-overlay"
      :class="{ 'is-minimized': minimized }"
      @click.self.stop="!minimized && close()"
    >
      <div
        class="cm-modal"
        :class="{ 'is-minimized': minimized }"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Source code modal'"
        @click="minimized && (minimized = false)"
      >
        <header class="cm-header">
          <div class="cm-title">
            <span class="cm-dot red" @click="close"></span>
            <span class="cm-text">{{ title ?? "Source code" }}</span>
          </div>

          <div class="cm-actions">
            <button
              class="cm-btn"
              type="button"
              @click="copyCode"
              aria-label="Copy code"
            >
              <svg class="cm-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 9h10v10H9V9Z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
              <span class="cm-btn-text">
                {{ copied ? "Copied" : "Copy" }}
              </span>
            </button>
          </div>
        </header>

        <div class="cm-body">
          <pre class="cm-pre"><code>{{ sourceCode }}</code></pre>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* Overlay */
.cm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 9999;
  transition: opacity 220ms ease, backdrop-filter 220ms ease;
}

/* More padding on larger screens */
@media (min-width: 640px) {
  .cm-overlay {
    padding: 24px;
  }
}

.cm-overlay.is-minimized {
  opacity: 0.12;
  backdrop-filter: blur(0px);
  pointer-events: none;
}

/* Modal */
.cm-modal {
  width: 100%;
  max-width: 980px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
  transform-origin: top left;
  transition:
    transform 360ms cubic-bezier(0.2, 0.9, 0.2, 1),
    opacity 220ms ease,
    filter 220ms ease;
}

/* Small screen improvement */
@media (max-width: 640px) {
  .cm-modal {
    border-radius: 12px;
    max-height: 92vh;
  }
}

.cm-modal.is-minimized {
  transform: translate(calc(-50vw + 68px), calc(50vh - 54px)) scale(0.12);
  opacity: 0.35;
  filter: blur(0.6px);
  pointer-events: auto;
  cursor: pointer;
}

/* Header */
.cm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: #0b1224;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

/* Stack properly on small screens */
@media (max-width: 480px) {
  .cm-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .cm-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

.cm-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cm-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  cursor: pointer;
}
.cm-dot.red {
  background: #ff5f56;
}

.cm-text {
  color: rgba(255, 255, 255, 0.86);
  font-size: 13px;
  letter-spacing: 0.2px;
}

/* Actions */
.cm-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cm-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    transform 0.06s ease,
    background 0.15s ease,
    border-color 0.15s ease;
}

.cm-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.18);
}

.cm-btn:active {
  transform: translateY(1px);
}

.cm-icon {
  width: 16px;
  height: 16px;
}

.cm-btn-text {
  font-size: 12px;
  font-weight: 600;
}

/* Body */
.cm-body {
  overflow: auto;
  flex: 1;
}

/* Code block */
.cm-pre {
  margin: 0;
  padding: 14px;
  background: #0f172a;
  color: #e5e7eb;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  line-height: 1.5;
  white-space: pre;
  overflow-x: auto;
}

/* Slightly larger code on bigger screens */
@media (min-width: 768px) {
  .cm-pre {
    font-size: 13px;
    padding: 16px;
  }
}

</style>