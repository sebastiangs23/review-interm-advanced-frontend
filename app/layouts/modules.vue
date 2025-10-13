<script setup lang="ts">
import { useRouter } from "vue-router";
import { useSettingsStore } from "../../stores/settings.ts";
import { useUserStore } from "../../stores/user.ts";

const settings = useSettingsStore();
const user = useUserStore();
const router = useRouter();

definePageMeta({
  layout: "modules",
});

const logOut = () => {
  try {
    router.push("/");
    user.logout();
    alert("You have been logged out.");
  } catch (error: any) {
    alert("Something went wrong");
  }
};
</script>
<template>
  <div class="modules">
    <aside class="modules__sidebar">
      <h2 class="modules__logo">Admin Panel</h2>

      <nav class="modules__nav">
        <NuxtLink to="/dashboard/users" class="modules__link">Users</NuxtLink>
        <NuxtLink to="/dashboard/finance" class="modules__link"
          >Finance</NuxtLink
        >
        <NuxtLink to="/dashboard/settings" class="modules__link"
          >Settings</NuxtLink
        >
      </nav>
    </aside>

    <section
      class="modules__main"
      :style="{
        backgroundColor: settings.background === 'gray' ? '#f3f4f6' : 'white',
      }"
    >
      <header class="modules__header">
        <h1 class="modules__title">Dashboard</h1>
        <button @click="logOut()" class="modules__logout">Logout</button>
      </header>

      <main class="modules__content">
        <slot />
      </main>
    </section>
  </div>
</template>

<style scoped>
.modules {
  display: flex;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

.modules__nav {
  font-family: var(--font-base);
  color: #374151;
}

/* --- Sidebar --- */
.modules__sidebar {
  width: 240px;
  background: linear-gradient(180deg, #59c080, #4fadbe);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.modules__logo {
  font-family: var(--font-base);
  font-weight: 700;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.modules__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modules__link {
  font: var(--font-base);
  color: white;
  text-decoration: none;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  transition: background 0.2s;
}

.modules__link:hover,
.modules__link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

/* --- Main Area --- */
.modules__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.modules__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.modules__title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
}

.modules__logout {
  background: linear-gradient(90deg, #59c080, #4fadbe);
  border: none;
  color: white;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.modules__logout:hover {
  opacity: 0.9;
}

.modules__content {
  flex: 1;
  padding: 2rem;
}
</style>
