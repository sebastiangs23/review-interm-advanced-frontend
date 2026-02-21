<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import type { User } from "../types/user";
import { subModules } from "../utils/common";
import { logOut } from "../utils/utils";
import { useSettingsStore } from "../../stores/settings";
import Cart from "../components/Cart.vue";
import ModalFullCart from "../components/modals/ModalFullCart.vue";
import ShowCode from "../components/ShowCode.vue";
import ModalConfirmation from "../components/modals/ModalConfirmation.vue";

import logo from "../assets/sg-logo-main.png";

import { Bars3Icon, ChevronLeftIcon } from "@heroicons/vue/24/outline";

const settings = useSettingsStore();
const router = useRouter();
const colorPalette = settings.colorButtons;
const { colorButtons } = storeToRefs(settings);

definePageMeta({
  layout: "modules",
});

const currentUser = ref<User>({
  username: "",
  email: "",
  password: "",
  submodules: [],
});
const subModulesFormatted = ref();
const isSidebarOpen = ref<boolean>(false);
const isSidebarCollapsed = ref(false);
const isActive = ref<boolean>(false);
const openCartModal = ref<boolean>(false);
const modalConfirmation = ref<boolean>(false);

onMounted(() => {
  currentUser.value = JSON.parse(localStorage.getItem("currentUser"));

  const accessByName = new Map(
    (currentUser.value?.submodules ?? []).map((s: any) => [
      s.submodule,
      s.access,
    ]),
  );

  subModulesFormatted.value = subModules
    .map((sub) => ({
      ...sub,
      access: accessByName.get(sub.name) ?? false,
    }))
    .filter((sub) => sub.access);
});

const openCart = () => {
  openCartModal.value = true;
};

const logOutFn = () => {
  logOut();
  router.push("/");
};
</script>
<template>
  <div class="flex min-h-screen font-bold flex-col md:flex-row">
    <aside
      class="fixed md:static inset-y-0 left-0 z-40 bg-[var(--bg-color-secondary)] flex flex-col transform transition-all duration-300"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
        isSidebarCollapsed ? 'md:w-20' : 'md:w-60',
        'w-60',
      ]"
    >
      <div
        class="flex items-center justify-between px-4 py-3 text-[var(--color-base)] md:hidden"
      >
        <img :src="logo" alt="logo" class="w-[5rem]" />
        <h2 class="text-lg w-[8rem] font-bold">Admin Panel</h2>

        <button @click="isSidebarOpen = false">
          <ChevronLeftIcon class="w-6 h-6" />
        </button>
      </div>

      <header
        class="hidden md:flex items-center justify-between py-3 text-[var(--color-base)]"
      >
        <div class="flex items-center gap-2">
          <img :src="logo" alt="logo" class="w-[5rem]" />
          <h2 v-if="!isSidebarCollapsed" class="text-xl font-bold">
            Admin Panel
          </h2>
        </div>

        <button class="p-2" @click="isSidebarCollapsed = !isSidebarCollapsed">
          <ChevronLeftIcon
            class="w-6 h-6 transition-transform"
            :class="isSidebarCollapsed ? 'rotate-180' : ''"
          />
        </button>
      </header>

      <nav class="font-[var(--font-base)] flex flex-col gap-4 mt-6 pr-6">
        <NuxtLink
          v-for="sub in subModulesFormatted"
          :key="sub.route"
          :to="sub.to"
          active-class="btn__base_2 btn__shadow border-2 border-[var(--color-dark)]"
          class="flex items-center gap-3 text-[var(--color-text-primary)] md:text-lg text:sm pl-4 py-4"
          :class="isSidebarCollapsed ? 'hidden' : ''"
          @click="isSidebarOpen = false"
        >
          <component :is="sub.icon" :class="isSidebarCollapsed ? 'md:hidden' : 'w-5 h-5 shrink-0'" />
          <span>
          {{ sub.name }}
          </span>
        </NuxtLink>
      </nav>
    </aside>

    <section class="flex flex-col flex-1 p-6 bg-(--bg-color-third)">
      <header
        class="flex items-center justify-between gap-4 p-3 md:px-4 md:pb-6 mb-4 md:mb-0 rounded-[14px] bg-[var(--input-bg-color)] btn__shadow border-2 border-[var(--color-dark)]"
      >
        <!-- Mobile toggle -->
        <button class="md:hidden p-2" @click="isSidebarOpen = !isSidebarOpen">
          <Bars3Icon class="w-6 h-6" />
        </button>

        <ShowCode />

        <div class="flex gap-2 md:gap-3 justify-center items-center">
          <Cart @click="openCart" />

          <button
            @click="modalConfirmation = true"
            class="bg-[var(--color-base)] p-2 md:p-4 btn rounded-lg text-xs sm:text-base"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main class="flex-1 md:p-[2rem]">
        <slot />
      </main>
    </section>

    <ModalFullCart :open="openCartModal" @close="openCartModal = false" />

    <ModalConfirmation
      :show="modalConfirmation"
      title="¿Do you want to log out?"
      description="You can sign in again anytime."
      leftButton="Cancel"
      rightButton="Log out"
      @close="modalConfirmation = false"
      @confirm="logOutFn()"
    />
  </div>
</template>
