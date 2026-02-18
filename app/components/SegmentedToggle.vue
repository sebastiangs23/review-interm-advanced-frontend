<script setup lang="ts">
import { computed } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

const isSignup = computed(() => route.path === "/signup")

function go(path: "/" | "/signup") {
  if (route.path !== path) router.push(path)
}
</script>

<template>
  <div
    class="mx-auto mb-5 w-full max-w-[320px] rounded-full border border-black/30 bg-black/20 p-1 btn__shadow"
  >
    <div class="relative flex">
      <!-- sliding pill -->
      <span
        class="absolute top-0 bottom-0 w-1/2 rounded-full bg-[var(--color-base)] transition-transform duration-200"
        :class="isSignup ? 'translate-x-full' : 'translate-x-0'"
      />

      <!-- Sign in -->
      <button
        type="button"
        class="relative z-10 w-1/2 rounded-full py-2 text-sm font-bold transition"
        :class="isSignup ? 'text-white/70 hover:text-white' : 'text-black'"
        @click="go('/')"
      >
        Sign In
      </button>

      <!-- Sign up -->
      <button
        type="button"
        class="relative z-10 w-1/2 rounded-full py-2 text-sm font-bold transition"
        :class="isSignup ? 'text-black' : 'text-white/70 hover:text-white'"
        @click="go('/signup')"
      >
        Sign Up
      </button>
    </div>
  </div>
</template>
