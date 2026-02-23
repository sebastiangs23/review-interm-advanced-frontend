<script setup lang="ts">
import { useNuxtApp } from "#app";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logIn } from "../utils/utils";
import SegmentedAuthToggle from "../components/SegmentedToggle.vue";
import InfiniteLoopTicker from "../components/InfiniteLoopTicker.vue";

import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

import logo from "../assets/sg-logo-main.png";
import { technologies } from "../assets/assets";

const router = useRouter();
const { $toast } = useNuxtApp();

const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref(false);

const errorMessage = ref<string>("");
const loading = ref<boolean>(false);

const handleSubmit = async () => {
  errorMessage.value = "";

  try {
    const response = await logIn(email.value, password.value);
    if (response?.status === "success") {
      router.push("/dashboard");
      $toast.success(response?.message);
    } else if (response?.status === "error") {
      $toast.warning(response?.message);
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Unexpected error occurred";
  }
};

const notifyFrontendOnly = (provider: string) => {
  try {
    $toast.info(
      `I'm thinking to implement Amazon Cognito for auth with ${provider}. For the moment only frontend demo :(`,
    );
  } catch (error) {
    $toast.warning(`Something went wrong with ${provider} login.`);
  }
};
</script>

<template>
  <main class="font-bold min-h-screen bg-[var(--bg-color-primary)]">
    <header class="absolute top-1 left-2 sm:top-6 sm:left-6">
      <img :src="logo" class="md:w-24 w-16" alt="Logo" />
    </header>

    <div class="flex justify-center">
      <section
        class="bg-[var(--bg-color-secondary)] rounded-[1.25rem] p-10 h-136 md:h-152 max-w-95 md:mt-12 mt-2 md:mx-0 mx-3 btn__shadow"
      >
        <SegmentedAuthToggle />

        <div class="text-center md:mb-4 mb-1">
          <h1
            class="md:text-[2rem] text-[1.75rem] font-bold text-[var(--bg-color-primary)] bg-[var(--color-base)] rounded-2xl px-4 mb-4"
          >
            Login
          </h1>
          <p class="md:text-[0.95rem] text-[0.75rem] text-gray-500">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        <form
          class="flex flex-col md:gap-4 gap-2"
          @submit.prevent="handleSubmit"
        >
          <!-- Email -->
          <div class="flex flex-col">
            <label
              for="email"
              class="mb-2 md:text-[1rem] text-[0.9rem] font-medium text-[var(--color-text-primary)]"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              class="rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)] focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
              v-model="email"
              required
            />
          </div>

          <!-- Password with eye -->
          <div class="flex flex-col">
            <label
              for="password"
              class="mb-2 md:text-[1rem] text-[0.9rem] font-medium text-[var(--color-text-primary)]"
            >
              Password
            </label>

            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full rounded-full px-4 py-3 pr-12 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)] focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                v-model="password"
                required
              />

              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-black/10 transition"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <EyeSlashIcon
                  v-if="showPassword"
                  class="h-5 w-5 text-gray-500"
                />
                <EyeIcon v-else class="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="mt-1 md:mb-0 mb-3 inline-flex items-center justify-center rounded-full border border-[var(--black-color)] bg-[var(--color-base)] px-4 py-3 font-bold text-black btn__shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ loading ? "Signing in..." : "Sign In" }}
          </button>

          <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-500">
            {{ errorMessage }}
          </p>

          <!-- Social icons/buttons -->
          <div class="flex justify-center gap-3">
            <button
              type="button"
              class="wave-style wave-style--small cursor-pointer"
              @click="notifyFrontendOnly('Google')"
              aria-label="Google login demo"
            >
              <Icon name="simple-icons:google" class="h-5 w-5" />
            </button>

            <button
              type="button"
              class="wave-style wave-style--small cursor-pointer"
              @click="notifyFrontendOnly('GitHub')"
              aria-label="GitHub login demo"
            >
              <Icon name="simple-icons:github" class="h-5 w-5" />
            </button>

            <button
              type="button"
              class="wave-style wave-style--small cursor-pointer"
              @click="notifyFrontendOnly('Apple')"
              aria-label="Apple login demo"
            >
              <Icon name="simple-icons:apple" class="h-5 w-5" />
            </button>
          </div>
        </form>

        <footer class="text-center mt-6">
          <p
            class="md:text-[1rem] text-[0.75rem] text-[var(--color-text-primary)]"
          >
            Don’t have an account?
            <NuxtLink
              to="/signup"
              class="font-semibold text-[var(--color-base-secondary)] no-underline hover:text-[var(--color-base)]"
            >
              Create one
            </NuxtLink>
          </p>
        </footer>
      </section>
    </div>

    <InfiniteLoopTicker />
  </main>
</template>