<!-- eslint-disable vue/multi-word-component-names -->

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { logIn } from "../utils/utils";

const username = ref("");
const password = ref("");
const errorMessage = ref("");
const loading = ref(false);

const router = useRouter();

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
</script>

<template>
  <main class="login font-bold">
    <section class="login__container">
      <header class="login__header">
        <h1 class="login__title">Login</h1>
        <p class="login__subtitle">Welcome back! Please sign in to continue.</p>
      </header>

      <form class="login__form" @submit.prevent="handleSubmit">
        <div class="flex flex-col">
          <label for="username" class="login__label mb-2">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            class="login__input"
            v-model="username"
            required
          />
        </div>

        <div class="flex flex-col">
          <label for="password" class="login__label mb-2">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="login__input"
            v-model="password"
            required
          />
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>

        <p v-if="errorMessage" class="login__error">{{ errorMessage }}</p>
      </form>

      <footer class="login__footer">
        <p class="login__text">
          Don’t have an account?
          <NuxtLink to="/signup" class="login__link">Create one</NuxtLink>
        </p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-color-primary);
  font-family: var(--font-base);
  font-weight: 700;
}

.login__container {
  background-color: var(--bg-color-secondary);
  padding: 2.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 380px;
}

.login__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.login__subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login__label {
  font-weight: 500;
  color: var(--color-text-primary);
}

.login__input {
  @apply rounded-full;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  transition: 0.2s;
  background: var(--input-bg-color);
  color: var(--color-text-primary);
  font-family: var(--font-base);
}

.login__button {
  @apply rounded-full;
  background: #abf600;
  color: #000000;
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  border-color: var(--black-color);
  padding: 0.75rem;
  transition: 0.25s;
}

.login__button:hover {
  opacity: 0.9;
}

.login__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login__error {
  color: #ef4444;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.login__footer {
  text-align: center;
  margin-top: 1.5rem;
}

.login__link {
  color: #4fadbe;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.login__link:hover {
  color: #59c080;
}
</style>
