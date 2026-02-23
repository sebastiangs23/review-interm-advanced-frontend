<script setup lang="ts">
import { useNuxtApp } from "#app";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logIn } from "../utils/utils";
import SegmentedAuthToggle from "../components/SegmentedToggle.vue";
import InfiniteLoopTicker from "../components/InfiniteLoopTicker.vue";
import Divider from "../components/Divider.vue";

import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

import { technologies } from "../assets/assets";
import logo from "../assets/sg-logo-main.png";
import icon from "../assets/web-design.svg";

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
  <main class="min-h-screen bg-[var(--bg-color-primary)] font-bold">
    <!-- Header -->
    <header class="absolute left-3 top-3 sm:left-6 sm:top-6">
      <img :src="logo" class="w-16 md:w-24" alt="Logo" />
    </header>

    <!-- Layout -->
    <div class="min-h-screen flex flex-col">
      <div class="flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 sm:px-8 pt-24 pb-10">
        <!-- Left (Desktop only) -->
        <aside class="hidden md:flex flex-col md:items-center md:justify-center gap-6">
          <div class="leading-tight">
            <span class="block text-white text-4xl">
              &lt;/ This is only a 
            </span>
            <span class="block text-4xl text-[var(--color-base)]">
              Frontend demo project. /&gt;
            </span>
          </div>

          <img
            :src="icon"
            alt="web design icon"
            class="w-full max-w-sm h-auto"
          />

          <InfiniteLoopTicker />
        </aside>

        <!-- Right (Login + Carrousel on mobile) -->
        <section class="flex items-center justify-center md:justify-start">
          <Divider :vertical="true" customizeClass="mr-30"/>
          <div class="w-full max-w-[26rem]">
            <div
              class="bg-[var(--bg-color-secondary)] rounded-[1.25rem] p-6 sm:p-10 btn__shadow md:mt-0"
            >
              <SegmentedAuthToggle />

              <div class="text-center mb-4">
                <h1
                  class="text-[1.75rem] md:text-[2rem] font-bold text-[var(--bg-color-primary)] bg-[var(--color-base)] rounded-2xl px-4 mb-3"
                >
                  Login
                </h1>
                <p class="text-[0.75rem] md:text-[0.95rem] text-gray-500">
                  Welcome back! Please sign in to continue.
                </p>
              </div>

              <form class="flex flex-col gap-2 md:gap-4" @submit.prevent="handleSubmit">
                <!-- Email -->
                <div class="flex flex-col">
                  <label
                    for="email"
                    class="mb-2 text-[0.9rem] md:text-[1rem] font-medium text-[var(--color-text-primary)]"
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

                <!-- Password -->
                <div class="flex flex-col">
                  <label
                    for="password"
                    class="mb-2 text-[0.9rem] md:text-[1rem] font-medium text-[var(--color-text-primary)]"
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
                      <EyeSlashIcon v-if="showPassword" class="h-5 w-5 text-gray-500" />
                      <EyeIcon v-else class="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="mt-1 inline-flex items-center justify-center rounded-full border border-[var(--black-color)] bg-[var(--color-base)] px-4 py-3 font-bold text-black btn__shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {{ loading ? "Signing in..." : "Sign In" }}
                </button>

                <p v-if="errorMessage" class="mt-2 text-center text-sm text-red-500">
                  {{ errorMessage }}
                </p>

                <!-- Social -->
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

                <div class="text-center mt-4">
                  <p class="text-[0.75rem] md:text-[1rem] text-[var(--color-text-primary)]">
                    Don’t have an account?
                    <NuxtLink
                      to="/signup"
                      class="font-semibold text-[var(--color-base-secondary)] no-underline hover:text-[var(--color-base)]"
                    >
                      Create one
                    </NuxtLink>
                  </p>
                </div>
              </form>
            </div>

            <!-- Carrousel (mobile only) -->
            <div class="mt-6 md:hidden">
              <InfiniteLoopTicker />
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="px-4 sm:px-8 pb-6">
        <p class="text-center text-xs text-white/60">
          © 2026 Sebastián Gómez Salinas. All rights reserved.
        </p>
      </footer>
    </div>
  </main>
</template>