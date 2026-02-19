<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

import { useUsers } from "../composables/user";
import SegmentedAuthToggle from "../components/SegmentedToggle.vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

import logo from "../assets/sg-logo-main.png";

const router = useRouter();
const { $toast } = useNuxtApp();
const { add } = useUsers();

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

const showPassword = ref(false);

const loading = ref<boolean>(false);
const errorMessage = ref<string>("");

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const data = {
      username: username.value,
      email: email.value,
      password: password.value,
    };

    const response = await add(data);

    if (response?.status === 200) {
      $toast.success("Account created successfully! Redirecting to dashboard...");
      localStorage.setItem("currentUser", JSON.stringify(data));
      router.push("/dashboard");
    } else {
      $toast.error(response?.message);
      errorMessage.value = response?.message || "Failed to create account";
    }
  } catch (err: any) {
    errorMessage.value = err.message || "Unexpected error occurred";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="flex items-center justify-center min-h-screen bg-[var(--bg-color-primary)]">
    <header class="absolute top-2 left-2 sm:top-6 sm:left-6">
      <img :src="logo" class="w-24" alt="Logo" />
    </header>

    <section
      class="bg-[var(--bg-color-secondary)] p-2 rounded-[1.25rem] sm:mt-0 max-w-95 p-10 mt-12 w-full btn__shadow font-semibold"
    >
    <SegmentedAuthToggle />
      <div class="text-center mb-6">
        <h1
          class="text-[2rem] font-bold text-[var(--bg-color-primary)] bg-[var(--color-base)] rounded-2xl px-4 mb-4"
        >
          Create Account
        </h1>
        <p class="text-[0.95rem] text-gray-500 font-[var(--font-base)]">
          Join us and start exploring today!
        </p>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <!-- Username -->
        <div class="flex flex-col">
          <label for="username" class="mb-2 font-medium text-[var(--color-text-primary)]">
            Username
          </label>

          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            class="rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]
                   focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
            v-model="username"
            required
          />
        </div>

        <!-- Email -->
        <div class="flex flex-col">
          <label for="email" class="mb-2 font-medium text-[var(--color-text-primary)]">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="rounded-full px-4 py-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]
                   focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
            v-model="email"
            required
          />
        </div>

        <!-- Password with Eye -->
        <div class="flex flex-col">
          <label for="password" class="mb-2 font-medium text-[var(--color-text-primary)]">
            Password
          </label>

          <div class="relative">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              class="w-full rounded-full px-4 py-3 pr-12 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)]
                     focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
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

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="mt-1 inline-flex items-center justify-center rounded-full border border-[var(--black-color)] bg-[var(--color-base)] px-4 py-3 font-bold text-black btn__shadow
                 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ loading ? "Creating..." : "Sign Up" }}
        </button>

        <p v-if="errorMessage" class="signup__error">{{ errorMessage }}</p>
      </form>

      <footer class="text-center mt-6">
        <p class="text-[var(--color-text-primary)]">
          Already have an account?
          <NuxtLink
            to="/"
            class="font-semibold text-[var(--color-base-secondary)] no-underline hover:text-[var(--color-base)]"
          >
            Sign in
          </NuxtLink>
        </p>
      </footer>
    </section>
  </main>
</template>
