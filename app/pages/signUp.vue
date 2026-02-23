<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

import { useUsers } from "../composables/user";
import SegmentedAuthToggle from "../components/SegmentedToggle.vue";
import InfiniteLoopTicker from "../components/InfiniteLoopTicker.vue";

import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { technologies } from "../assets/assets";

import logo from "../assets/sg-logo-main.png";
import icon from "../assets/web-design.svg";

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

  const emailValue = email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(emailValue)) {
    const msg = "Please enter a valid email address.";
    errorMessage.value = msg;
    $toast.warning(msg);
    loading.value = false;
    return;
  }

  const pass = password.value;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passRegex.test(pass)) {
    const msg =
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.";
    errorMessage.value = msg;
    $toast.warning(msg);
    loading.value = false;
    return;
  }

  try {
    const data = {
      username: username.value.trim(),
      email: emailValue,
      password: pass,
    };

    const response = await add(data);

    if (response?.status === 200) {
      $toast.success("Account created successfully! Redirecting to dashboard...");
      localStorage.setItem("currentUser", JSON.stringify(data));
      router.push("/dashboard");
    } else {
      const msg = response?.message || "Failed to create account";
      $toast.error(msg);
      errorMessage.value = msg;
    }
  } catch (err: any) {
    const msg = err?.message || "Unexpected error occurred";
    errorMessage.value = msg;
    $toast.error(msg);
  } finally {
    loading.value = false;
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
      <div
        class="flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 sm:px-8 pt-24 pb-10"
      >
        <!-- Left (Desktop only) -->
        <aside
          class="hidden md:flex flex-col md:items-center md:justify-center gap-6"
        >
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

        <!-- Right (Signup + Carrousel on mobile) -->
        <section class="flex items-center justify-center md:justify-start">
          <Divider :vertical="true" customizeClass="md:mr-30 hidden md:block" />

          <div class="w-full max-w-[26rem]">
            <div
              class="bg-[var(--bg-color-secondary)] rounded-[1.25rem] p-6 sm:p-10 btn__shadow"
            >
              <SegmentedAuthToggle />

              <div class="text-center mb-4">
                <h1
                  class="text-[1.75rem] md:text-[2rem] font-bold text-[var(--bg-color-primary)] bg-[var(--color-base)] rounded-2xl px-4 mb-3"
                >
                  Create Account
                </h1>
                <p
                  class="text-[0.75rem] md:text-[0.95rem] text-gray-500 font-[var(--font-base)]"
                >
                  Join us and start exploring today!
                </p>
              </div>

              <form
                class="flex flex-col gap-3 md:gap-4"
                @submit.prevent="handleSubmit"
              >
                <!-- Username (floating) -->
                <div class="relative">
                  <input
                    id="username"
                    type="text"
                    v-model="username"
                    placeholder=" "
                    required
                    class="peer w-full rounded-full px-4 pt-5 pb-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)] focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                  />
                  <label
                    for="username"
                    class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--color-base)] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Username
                  </label>
                </div>

                <!-- Email (floating) -->
                <div class="relative">
                  <input
                    id="email"
                    type="email"
                    v-model="email"
                    placeholder=" "
                    required
                    class="peer w-full rounded-full px-4 pt-5 pb-3 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)] focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                  />
                  <label
                    for="email"
                    class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--color-base)] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Email
                  </label>
                </div>

                <!-- Password (floating + eye) -->
                <div class="relative">
                  <input
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder=" "
                    required
                    class="peer w-full rounded-full px-4 pt-5 pb-3 pr-12 border border-gray-300 transition bg-[var(--input-bg-color)] text-[var(--color-text-primary)] font-[var(--font-base)] focus:outline-none focus:border-[var(--color-base)] focus:ring-2 focus:ring-[var(--color-base)]/20"
                  />
                  <label
                    for="password"
                    class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 transition-all peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-[var(--color-base)] peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 hover:bg-black/10 transition"
                    @click="showPassword = !showPassword"
                    :aria-label="
                      showPassword ? 'Hide password' : 'Show password'
                    "
                  >
                    <EyeSlashIcon
                      v-if="showPassword"
                      class="h-5 w-5 text-gray-500"
                    />
                    <EyeIcon v-else class="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="mt-1 inline-flex items-center justify-center rounded-full border border-[var(--black-color)] bg-[var(--color-base)] px-4 py-3 font-bold text-black btn__shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {{ loading ? "Creating..." : "Sign Up" }}
                </button>

                <div class="text-center mt-4">
                  <p
                    class="text-[0.75rem] md:text-[1rem] text-[var(--color-text-primary)]"
                  >
                    Already have an account?
                    <NuxtLink
                      to="/"
                      class="font-semibold text-[var(--color-base-secondary)] no-underline hover:text-[var(--color-base)]"
                    >
                      Sign in
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
