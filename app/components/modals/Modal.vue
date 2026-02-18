<script setup lang="ts">
import { useNuxtApp } from "#app"
import { onBeforeUnmount, onMounted, ref } from "vue"
import {
  XMarkIcon,
  PencilSquareIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/vue/24/outline"

const { $toast } = useNuxtApp()

defineProps<{
  show: boolean
  title: string
  content: string
  buttonText: string
  typeModal: number // 1: create & 2: edit
  form: {
    username: string
    email: string
    password: string
  }
}>()

const emit = defineEmits<{
  (event: "close"): void
  (event: "confirm"): void
}>()

const showPassword = ref(false)

const closeModal = () => emit("close")
const confirmAction = () => emit("confirm")

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeModal()
}

onMounted(() => window.addEventListener("keydown", onKeydown))
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown))
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
      <div
        v-if="show"
        class="fixed inset-0 z-50 grid place-items-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- overlay -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal" />

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
        >
          <div
            v-if="show"
            class="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[var(--bg-color-secondary)] shadow-2xl ring-1 ring-white/10"
          >
            <!-- Header -->
            <div class="flex items-start justify-between gap-4 border-b border-white/10 p-5">
              <div class="min-w-0">
                <h2 class="text-base font-semibold text-white md:text-lg">
                  {{ title }}
                </h2>
                <p v-if="content" class="mt-1 text-sm text-white/55 leading-relaxed">
                  {{ content }}
                </p>
              </div>

              <button
                class="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                @click="closeModal"
                aria-label="Close modal"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="p-5">
              <div class="space-y-4">
                <!-- Username -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-white/60">Username</label>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="e.g. John Doe"
                    class="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                  />
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-white/60">Email</label>
                  <input
                    :disabled="typeModal === 2"
                    v-model="form.email"
                    type="email"
                    placeholder="example@mail.com"
                    class="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <p v-if="typeModal === 2" class="text-[11px] text-white/40">
                    Email can’t be edited in this mode.
                  </p>
                </div>

                <!-- Password + Eye -->
                <div class="space-y-1.5">
                  <label class="text-xs font-semibold text-white/60">Password</label>

                  <div class="relative">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      class="h-11 w-full rounded-xl border border-white/10 bg-white/10 px-4 pr-11 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                    />

                    <button
                      type="button"
                      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
                      @click="showPassword = !showPassword"
                      :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    >
                      <EyeSlashIcon v-if="showPassword" class="h-5 w-5" />
                      <EyeIcon v-else class="h-5 w-5" />
                    </button>
                  </div>

                  <p class="text-[11px] text-white/40">
                    Tip: use at least 8 characters.
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer / Actions (responsive) -->
            <div class="flex flex-col gap-2 border-t border-white/10 p-5 sm:flex-row sm:justify-end">
              <button
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 transition sm:w-auto"
                @click="closeModal"
              >
                <XCircleIcon class="h-5 w-5" />
                Cancel
              </button>

              <button
                class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-base)] px-4 py-2 text-sm font-bold text-black shadow-sm hover:brightness-110 transition sm:w-auto"
                @click="confirmAction"
              >
                <PencilSquareIcon class="h-5 w-5" />
                {{ buttonText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
