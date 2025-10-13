<template>
  <main class="signup">
    <section class="signup__container">
      <header class="signup__header">
        <h1 class="signup__title">Create Account</h1>
        <p class="signup__subtitle">Join us and start exploring today!</p>
      </header>

      <form class="signup__form" @submit.prevent="handleSubmit">
        <div class="signup__field">
          <label for="username" class="signup__label">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username"
            class="signup__input"
            v-model="username"
            required
          />
        </div>

        <div class="signup__field">
          <label for="email" class="signup__label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            class="signup__input"
            v-model="email"
            required
          />
        </div>

        <div class="signup__field">
          <label for="password" class="signup__label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password"
            class="signup__input"
            v-model="password"
            required
          />
        </div>

        <button type="submit" class="signup__button" :disabled="loading">
          {{ loading ? 'Creating...' : 'Sign Up' }}
        </button>

        <p v-if="errorMessage" class="signup__error">{{ errorMessage }}</p>
      </form>

      <footer class="signup__footer">
        <p class="signup__text">
          Already have an account?
          <NuxtLink to="/" class="signup__link">Sign in</NuxtLink>
        </p>
      </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = {
      id: username.value,
      email: email.value,
      password: password.value
    };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(data);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({
      id: data.id,
      email: data.email
    }));
    router.push('/dashboard')

  } catch (err: any) {
    errorMessage.value = err.message || 'Unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* --- Layout --- */
.signup {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #e9f7ef, #e6f4f9);
  font-family: 'Inter', sans-serif;
}

.signup__container {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
}

/* --- Header --- */
.signup__header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.signup__title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #59c080, #4fadbe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

.signup__subtitle {
  font-size: 0.95rem;
  color: #6b7280;
}

/* --- Form --- */
.signup__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.signup__field {
  display: flex;
  flex-direction: column;
}

.signup__label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.signup__input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.signup__input:focus {
  outline: none;
  border-color: #4fadbe;
  box-shadow: 0 0 0 3px rgba(79, 173, 190, 0.2);
}

/* --- Button --- */
.signup__button {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: opacity 0.25s ease;
}

.signup__button:hover {
  opacity: 0.9;
}

.signup__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* --- Error --- */
.signup__error {
  color: #ef4444;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* --- Footer --- */
.signup__footer {
  text-align: center;
  margin-top: 1.5rem;
}

.signup__text {
  color: #6b7280;
  font-size: 0.9rem;
}

.signup__link {
  color: #4fadbe;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signup__link:hover {
  color: #59c080;
}
</style>
