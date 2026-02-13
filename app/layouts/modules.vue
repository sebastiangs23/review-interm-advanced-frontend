<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { logOut } from "../utils/utils";
import { useSettingsStore } from "../../stores/settings";
import ShowCode from "../components/ShowCode.vue";
import { subModules } from "../utils/common";
import logo from "../assets/sg-logo.png";

import { Bars3Icon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const settings = useSettingsStore();
const router = useRouter();
const colorPalette = settings.colorButtons;
const { colorButtons } = storeToRefs(settings);

definePageMeta({
  layout: "modules",
});

const isSidebarOpen = ref(false);
const isActive = ref(false);

const logOutFn = () => {
  logOut();
  router.push("/");
};
</script>
<template>
  <div class="flex min-h-screen font-bold flex-col md:flex-row">
    <aside
      class="fixed md:static inset-y-0 left-0 z-40 w-60 bg-[var(--bg-color-secondary)] flex flex-col transform transition-transform duration-300"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ]"
    >
      <div class="flex items-center justify-between px-4 py-3 text-[var(--color-base)] md:hidden">
        <img :src="logo" alt="logo" class="w-[4rem]">
        <h2 class="text-lg w-[8rem] font-bold">Admin Panel</h2>

        <button @click="isSidebarOpen = false">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
      </div>

      <header class="hidden md:flex items-center  py-3 text-[var(--color-base)]">
        <img :src="logo" alt="logo" class="w-[5rem]">
        <h2 class="text-xl font-bold">Admin Panel</h2>
      </header>

      <nav class="font-[var(--font-base)] flex flex-col gap-4 mt-6 pr-6">
        <NuxtLink
          v-for="sub in subModules"
          :key="sub.route"
          :to="sub.to"
          active-class="btn__base_2 btn__shadow border-2 border-[var(--color-dark)]"
          class="flex items-center gap-3 text-[var(--color-text-primary)] text-lg pl-4 py-4 "
          @click="isSidebarOpen = false"
        >
          <component :is="sub.icon" class="w-5 h-5 shrink-0" />
          <span>{{ sub.name }}</span>
        </NuxtLink>
      </nav>
    </aside>
    
    <section
      class="flex flex-col flex-1 p-6 bg-(--bg-color-third)"
    >
      <header
        class="flex items-center justify-between gap-4 px-3 md:px-4 py-3 rounded-[14px] bg-[var(--input-bg-color)] btn__shadow pb-6 border-2 border-[var(--color-dark)]"
      >
        <!-- Mobile toggle -->
        <button class="md:hidden p-2" @click="isSidebarOpen = !isSidebarOpen">
          <Bars3Icon class="w-6 h-6" />
        </button>

        <ShowCode />
        
        <button @click="logOutFn()" class="bg-[var(--color-base)] p-4 btn text-xs sm:text-base ">
          LOGOUT
        </button>
      </header>

      <main class="flex-1 md:p-[2rem]  ">
        <slot />
      </main>
    </section>
  </div>
</template>