<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logIn } from "../utils/utils";
import { useToast } from "vue-toastification";

import logo from "../assets/sg-logo.png";

const router = useRouter();
const toast = useToast();

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = "";

  try {
    const response = logIn(username.value, password.value);
    if (response?.status === "success") {
      router.push("/dashboard");
    }
  } catch (err) {
    errorMessage.value = err.message || "Unexpected error occurred";
  }
};

const notifyFrontendOnly = (provider: string) => {
  try {
    toast.info(
      `${provider} login is not available. This is a frontend-only demo.`,
    );
  } catch (error) {
    console.log("Toast notification error:", error);
  }
};
</script>

<template>
  <main
    class="bg-[var(--bg-color-primary)] flex font-bold items-center justify-center min-h-screen"
  >
    <header class="absolute top-2 left-2 sm:top-6 sm:left-6">
      <img :src="logo" class="w-24" alt="Logo" />
    </header>

    <section
      class="bg-[var(--bg-color-secondary)] rounded-[1.25rem] sm:mt-0 max-w-95 p-10 mt-12 w-full btn__shadow"
    >
      <div class="text-center mb-6">
        <h1 class="text-[2rem] font-bold text-[var(--bg-color-primary)] bg-[var(--color-base)] rounded-2xl px-4 mb-4">
          Login
        </h1>
        <p class="text-[0.95rem] text-gray-500">
          Welcome back! Please sign in to continue.
        </p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="flex flex-col">
          <label
            for="username"
            class="mb-2 font-medium text-[var(--color-text-primary)]"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            class="rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]"
            v-model="username"
            required
          />
        </div>

        <div class="flex flex-col">
          <label
            for="password"
            class="mb-2 font-medium text-[var(--color-text-primary)]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]"
            v-model="password"
            required
          />
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
        <p class="text-[var(--color-text-primary)]">
          Don’t have an account?
          <NuxtLink
            to="/signup"
            class="font-semibold text-[#4fadbe] no-underline hover:text-[#59c080]"
          >
            Create one
          </NuxtLink>
        </p>
      </footer>
    </section>
  </main>
</template>
