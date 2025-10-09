<template>
  <main class="login">
    <section class="login__container">
      <header class="login__header">
        <h1 class="login__title">Login</h1>
        <p class="login__subtitle">Welcome back! Please sign in to continue.</p>
      </header>

      <form class="login__form" @submit.prevent="handleSubmit">
        <div class="login__field">
          <label for="username" class="login__label">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            class="login__input"
            v-model="username"
          />
        </div>

        <div class="login__field">
          <label for="password" class="login__label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            class="login__input"
            v-model="password"
          />
        </div>

        <button type="submit" class="login__button">Sign In</button>
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

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('User:', username.value, 'Password:', password.value)
}
</script>

<style scoped>
/* --- Layout --- */
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e9f7ef, #e6f4f9);
  font-family: 'Inter', sans-serif;
}

.login__container {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 380px;
}

/* --- Header --- */
.login__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login__title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #59c080, #4fadbe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

.login__subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

/* --- Form --- */
.login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login__field {
  display: flex;
  flex-direction: column;
}

.login__label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.login__input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.login__input:focus {
  outline: none;
  border-color: #4fadbe;
  box-shadow: 0 0 0 3px rgba(79, 173, 190, 0.2);
}

/* --- Button --- */
.login__button {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.login__button:hover {
  opacity: 0.9;
}

/* --- Footer --- */
.login__footer {
  text-align: center;
  margin-top: 1.5rem;
}

.login__text {
  color: #6b7280;
  font-size: 0.9rem;
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
