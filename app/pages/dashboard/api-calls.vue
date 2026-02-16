<script setup>
import Title from "../../components/Title.vue"
import Loader from "~/components/Loader.vue";
import Badge from "~/components/Badge.vue";
import { ShoppingCartIcon, StarIcon } from "@heroicons/vue/24/solid";

definePageMeta({
  layout: "modules",
});

import { ref } from "vue";

const items = ref([]);
const loading = ref(false);
const error = ref(false);

const getItems = async () => {
  loading.value = true;
  error.value = false;

  try {
    const response = await $fetch("https://fakestoreapi.com/products");

    items.value = response;
  } catch (error) {
    console.log(error);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>

<template>
  <Loader v-if="loading" />

  <Title text="Store" :size=1 />

  <section class="p-[1rem]" v-if="!loading && !error">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex flex-col btn__shadow border-2 border-[var(--color-dark)] rounded-4xl p-1.25"
      >
        <div class="h-52 bg-[#9be427] rounded-4xl mb-[1rem]">
          <div
            class="flex items-center justify-center h-45 bg-[#ededed] w-full px-6 rounded-4xl"
          >
            <img :src="item.image" :alt="item.title" class="h-40" />
          </div>
          <div class="flex items-center justify-center py-2">
            <span
              class="text-[var(--color-text-secondary)] text-black font-semibold text-xs"
            >
              {{ item?.category }}
            </span>
          </div>
        </div>

        <section class="flex justify-between">
          <Badge
            :text="item?.title"
            colorText="#AABBCC"
            class="max-w-[150px]"
          />
          <Badge
            :text="'$' + item?.price"
            colorText="#AABBCC"
            class="max-w-[90px]"
            :toolTipActive="false"
          />
        </section>

        <span
          class="flex bg-[var(--color-base)] rounded-md my-2 px-3 py-1 text-xs font-semibold leading-none w-[100px]"
        >
          <StarIcon
            v-for="n in Math.min(
              5,
              Math.floor(Number(item?.rating?.rate ?? 0)),
            )"
            :key="`item-${item.id}-full-${n}`"
            class="w-4 h-4 text-black"
          />

          <StarIcon
            v-for="n in 5 -
            Math.min(5, Math.floor(Number(item?.rating?.rate ?? 0)))"
            :key="`item-${item.id}-empty-${n}`"
            class="w-4 h-4 text-black/30"
          />
        </span>

        <div class="flex justify-center align-center mb-2">
          <button
            class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          >
            <ShoppingCartIcon class="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </article>
    </div>
  </section>

  <p v-if="error">
    Failed to load products. Please try again.
  </p>
</template>
