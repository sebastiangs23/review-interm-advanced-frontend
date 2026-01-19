<script setup lang="ts">
import { useRouter } from "vue-router";
import { logOut } from "../utils/utils.ts";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "../../stores/settings.ts";

const settings = useSettingsStore();
const router = useRouter();
const colorPalette = settings.colorButtons;
const { colorButtons } = storeToRefs(settings);

definePageMeta({
  layout: "modules",
});

const logOutFn = () => {
  logOut();
  router.push("/");
}

</script>
<template>
  <div class="modules">
    <aside class="modules__sidebar"
      :style="{
      background: `linear-gradient(
        180deg,
        ${settings.colorPalette},
        ${settings.background === 'gray'
          ? '#1f1f1f'
          : '#ffffff'}
      )`
    }"
    >
      <h2 class="modules__logo">Admin Panel</h2>

      <nav class="modules__nav">
        <NuxtLink to="/dashboard/users" class="modules__link">Users</NuxtLink>
        <NuxtLink to="/dashboard/store" class="modules__link"
          >Store</NuxtLink
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
        <button @click="logOutFn()"
         :style="{
          background: `linear-gradient(90deg, ${colorButtons}, #4fadbe)`,
          border: `none`,
          color: `white`,
          [border-radius]: `0.4rem`,
          padding: `0.5rem 1rem`,
          [font-weight]: 600,
          cursor: `pointer`,
         }"
         class="modules__logout">
          Logout
        </button>
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
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: background 0.3s ease;
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
  justify-content: flex-end;
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
