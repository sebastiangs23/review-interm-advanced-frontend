<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Title from "../../components/Title.vue";
import Loader from "~/components/Loader.vue";
import ModalCart from "~/components/modals/ModalCart.vue";
import Badge from "~/components/Badge.vue";
import { useApiCall } from "../../composables/apiCalls";
import { ShoppingCartIcon, StarIcon } from "@heroicons/vue/24/solid";
import {
  FunnelIcon,
  XMarkIcon,
  TagIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/vue/24/outline";

const config = useRuntimeConfig();

definePageMeta({
  layout: "modules",
});

const items = ref([]);
const filters = ref({});
const loader = ref(false);
const errorHandler = ref(false);
const modalCart = ref(false);
const productSelected = ref(null);

const { error, execute } = useApiCall(() => ({
  method: "GET",
  url: config.public.api,
}));

onMounted(() => {
  getItems();
});

const getItems = async () => {
  loader.value = true;
  error.value = false;

  try {
    const data = await execute();
    if (data) {
      items.value = data;

      const categories = [...new Set(data.map((item) => item.category))].sort(
        (a, b) => String(a).localeCompare(String(b))
      );

      const prices = data
        .map((i) => Number(i.price ?? 0))
        .filter((n) => Number.isFinite(n));

      const minPrice = prices.length ? Math.floor(Math.min(...prices)) : 0;
      const maxPrice = prices.length ? Math.ceil(Math.max(...prices)) : 0;

      filters.value = { categories, minPrice, maxPrice };

      uiFilters.value.priceMin = minPrice;
      uiFilters.value.priceMax = maxPrice;
    }
  } catch (e) {
    errorHandler.value = true;
  } finally {
    loader.value = false;
  }
};

const openModalCart = (item) => {
  productSelected.value = item;
  modalCart.value = true;
};

/** -------------------------
 * Filtros + Paginación
 * --------------------------*/
const uiFilters = ref({
  category: "all",
  priceMin: 0,
  priceMax: 0,
  minRating: 0, // 0..5
  sort: "default", // default | price_asc | price_desc | rating_desc
});

const pagination = ref({
  page: 1,
  perPage: 4,
});

const showFilters = ref(false);

const clampNumber = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const filteredItems = computed(() => {
  let list = [...items.value];

  if (uiFilters.value.category !== "all") {
    list = list.filter((i) => i.category === uiFilters.value.category);
  }

  const minP = clampNumber(uiFilters.value.priceMin, 0);
  const maxP = clampNumber(uiFilters.value.priceMax, filters.value?.maxPrice ?? 0);

  list = list.filter((i) => {
    const p = clampNumber(i.price, 0);
    return p >= minP && p <= maxP;
  });

  const minR = clampNumber(uiFilters.value.minRating, 0);
  list = list.filter((i) => clampNumber(i?.rating?.rate, 0) >= minR);

  switch (uiFilters.value.sort) {
    case "price_asc":
      list.sort((a, b) => clampNumber(a.price, 0) - clampNumber(b.price, 0));
      break;
    case "price_desc":
      list.sort((a, b) => clampNumber(b.price, 0) - clampNumber(a.price, 0));
      break;
    case "rating_desc":
      list.sort(
        (a, b) => clampNumber(b?.rating?.rate, 0) - clampNumber(a?.rating?.rate, 0)
      );
      break;
    default:
      break;
  }

  return list;
});

const totalPages = computed(() => {
  const total = filteredItems.value.length;
  return Math.max(1, Math.ceil(total / pagination.value.perPage));
});

const paginatedItems = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.perPage;
  const end = start + pagination.value.perPage;
  return filteredItems.value.slice(start, end);
});

const pageNumbers = computed(() => {
  const total = totalPages.value;
  const current = pagination.value.page;
  const windowSize = 5;

  let start = Math.max(1, current - Math.floor(windowSize / 2));
  let end = Math.min(total, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
});

const goToPage = (p) => {
  const target = Math.min(totalPages.value, Math.max(1, p));
  pagination.value.page = target;
};

const prevPage = () => goToPage(pagination.value.page - 1);
const nextPage = () => goToPage(pagination.value.page + 1);

const resetFilters = () => {
  uiFilters.value.category = "all";
  uiFilters.value.priceMin = filters.value?.minPrice ?? 0;
  uiFilters.value.priceMax = filters.value?.maxPrice ?? 0;
  uiFilters.value.minRating = 0;
  uiFilters.value.sort = "default";
  pagination.value.page = 1;
};

const clearCategory = () => {
  uiFilters.value.category = "all";
};

watch(
  () => [
    uiFilters.value.category,
    uiFilters.value.priceMin,
    uiFilters.value.priceMax,
    uiFilters.value.minRating,
    uiFilters.value.sort,
  ],
  () => {
    pagination.value.page = 1;
  }
);

watch(
  () => totalPages.value,
  () => {
    if (pagination.value.page > totalPages.value) {
      pagination.value.page = totalPages.value;
    }
  }
);

const activeFiltersCount = computed(() => {
  let c = 0;
  if (uiFilters.value.category !== "all") c++;
  const baseMin = filters.value?.minPrice ?? 0;
  const baseMax = filters.value?.maxPrice ?? 0;
  if (clampNumber(uiFilters.value.priceMin, baseMin) !== baseMin) c++;
  if (clampNumber(uiFilters.value.priceMax, baseMax) !== baseMax) c++;
  if (clampNumber(uiFilters.value.minRating, 0) > 0) c++;
  if (uiFilters.value.sort !== "default") c++;
  return c;
});

const priceMinDisplay = computed(() => clampNumber(uiFilters.value.priceMin, 0));
const priceMaxDisplay = computed(() => clampNumber(uiFilters.value.priceMax, 0));
</script>

<template>
  <Loader
    :active="loader"
    text="Loading"
    subtext="Please wait a second"
    :fullscreen="false"
  />

  <Title text="Store" :size="1" />

  <section class="p-4" v-if="!loader && !errorHandler">
    <!-- TOP BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div class="flex items-center gap-2">
        <button
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          type="button"
          @click="showFilters = !showFilters"
        >
          <FunnelIcon class="h-4 w-4" />
          Filters
          <span
            v-if="activeFiltersCount > 0"
            class="ml-1 px-2 py-[2px] text-xs font-bold rounded-full bg-[var(--color-base)] border-2 border-[var(--color-dark)]"
          >
            {{ activeFiltersCount }}
          </span>
        </button>

        <div class="text-sm font-semibold text-white">
          <span class="font-bold">{{ filteredItems.length }}</span>
          results
        </div>
      </div>

      <button
        class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
        type="button"
        @click="resetFilters"
        :disabled="activeFiltersCount === 0"
        :class="activeFiltersCount === 0 ? 'opacity-50 cursor-not-allowed' : ''"
      >
        <XMarkIcon class="h-4 w-4" />
        Reset
      </button>
    </div>

    <!-- FILTER PANEL -->
    <div
      v-if="showFilters"
      class="mb-5 border-2 border-[var(--color-dark)] rounded-3xl p-4 btn__shadow bg-[var(--input-bg-color)]"
    >
      <div class="flex items-center gap-2 mb-3  text-white">
        <AdjustmentsHorizontalIcon class="h-5 w-5" />
        <h3 class="font-bold">Refine your search</h3>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 text-white">
        <!-- CATEGORY CHIPS -->
        <div class="border-2 border-[var(--color-dark)] rounded-2xl p-3 bg-[var(--bg-color-third)]">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2 font-semibold">
              <TagIcon class="h-5 w-5" />
              Category
            </div>
            <button
              v-if="uiFilters.category !== 'all'"
              type="button"
              class="text-xs font-bold underline"
              @click="clearCategory"
            >
              Clear
            </button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-3 py-1 rounded-full border-2 border-[var(--color-dark)] text-xs font-semibold"
              :class="uiFilters.category === 'all' ? 'bg-[var(--color-base)]' : 'bg-[var(--input-bg-color)]'"
              @click="uiFilters.category = 'all'"
            >
              All
            </button>

            <button
              v-for="c in filters.categories"
              :key="c"
              type="button"
              class="px-3 py-1 rounded-full border-2 border-[var(--color-dark)] text-xs font-semibold"
              :class="uiFilters.category === c ? 'bg-[var(--color-base)]' : 'bg-[var(--input-bg-color)]'"
              @click="uiFilters.category = c"
            >
              {{ c }}
            </button>
          </div>
        </div>

        <!-- PRICE RANGE (double slider look) -->
        <div class="border-2 border-[var(--color-dark)] rounded-2xl p-3 bg-[var(--bg-color-third)]">
          <div class="flex items-center gap-2 font-semibold mb-2">
            <CurrencyDollarIcon class="h-5 w-5" />
            Price range
          </div>

          <div class="flex items-center justify-between text-sm font-semibold mb-2">
            <span class="px-2 py-1 rounded-xl border-2 border-[var(--color-dark)]">
              ${{ priceMinDisplay }}
            </span>
            <span class="text-xs opacity-70">to</span>
            <span class="px-2 py-1 rounded-xl border-2 border-[var(--color-dark)]">
              ${{ priceMaxDisplay }}
            </span>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold opacity-80">Min</label>
              <input
                v-model.number="uiFilters.priceMin"
                type="range"
                :min="filters.minPrice ?? 0"
                :max="uiFilters.priceMax"
                class="w-full accent-[var(--color-base)]"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold opacity-80">Max</label>
              <input
                v-model.number="uiFilters.priceMax"
                type="range"
                :min="uiFilters.priceMin"
                :max="filters.maxPrice ?? 0"
                class="w-full accent-[var(--color-base)]"
              />
            </div>
          </div>

          <div class="mt-3 grid grid-cols-2 gap-2">
            <input
              v-model.number="uiFilters.priceMin"
              type="number"
              :min="filters.minPrice ?? 0"
              :max="uiFilters.priceMax"
              class="border-2 border-[var(--color-dark)] rounded-xl px-3 py-2 bg-[var(--input-bg-color)] text-sm"
              placeholder="Min"
            />
            <input
              v-model.number="uiFilters.priceMax"
              type="number"
              :min="uiFilters.priceMin"
              :max="filters.maxPrice ?? 0"
              class="border-2 border-[var(--color-dark)] rounded-xl px-3 py-2 bg-[var(--input-bg-color)] text-sm"
              placeholder="Max"
            />
          </div>
        </div>

        <!-- REVIEWS + SORT -->
        <div class="border-2 border-[var(--color-dark)] rounded-2xl p-3 bg-[var(--bg-color-third)]">
          <div class="flex items-center gap-2 font-semibold mb-3">
            <StarIcon class="h-5 w-5" />
            Reviews & sorting
          </div>

          <!-- Rating chips -->
          <div class="mb-4">
            <div class="text-xs font-semibold opacity-80 mb-2">Min rating</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="r in [0,1,2,3,4,5]"
                :key="`r-${r}`"
                type="button"
                class="px-3 py-1 rounded-full border-2 border-[var(--color-dark)] text-xs font-semibold flex items-center gap-1"
                :class="uiFilters.minRating === r ? 'bg-[var(--color-base)]' : 'bg-[var(--input-bg-color)]'"
                @click="uiFilters.minRating = r"
              >
                <StarIcon class="h-4 w-4" />
                <span>{{ r === 0 ? 'Any' : `${r}+` }}</span>
              </button>
            </div>
          </div>

          <!-- Sort -->
          <div>
            <div class="text-xs font-semibold opacity-80 mb-2">Sort</div>
            <select
              v-model="uiFilters.sort"
              class="border-2 border-[var(--color-dark)] rounded-xl px-3 py-2 bg-[var(--input-bg-color)] w-full"
            >
              <option value="default">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- GRID (responsive) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <article
        v-for="item in paginatedItems"
        :key="item.id"
        class="flex flex-col btn__shadow border-2 border-[var(--color-dark)] rounded-4xl p-1.25"
      >
        <div class="h-52 bg-[#9be427] rounded-4xl mb-[1rem]">
          <div class="flex items-center justify-center h-45 bg-[#ededed] w-full px-6 rounded-4xl">
            <img :src="item.image" :alt="item.title" class="h-40 object-contain" />
          </div>
          <div class="flex items-center justify-center py-2">
            <span class="text-[var(--color-text-secondary)] text-black font-semibold text-xs">
              {{ item?.category }}
            </span>
          </div>
        </div>

        <section class="flex flex-wrap justify-between gap-2">
          <Badge :text="item?.title" colorText="#AABBCC" class="md:max-w-[150px] max-w-[100px]" />
          <Badge :text="'$' + item?.price" colorText="#AABBCC" class="max-w-[90px]" :toolTipActive="false" />
        </section>

        <span class="flex bg-[var(--color-base)] rounded-md my-2 px-3 py-1 text-xs font-semibold leading-none w-[110px]">
          <StarIcon
            v-for="n in Math.min(5, Math.floor(Number(item?.rating?.rate ?? 0)))"
            :key="`item-${item.id}-full-${n}`"
            class="w-4 h-4 text-black"
          />
          <StarIcon
            v-for="n in 5 - Math.min(5, Math.floor(Number(item?.rating?.rate ?? 0)))"
            :key="`item-${item.id}-empty-${n}`"
            class="w-4 h-4 text-black/30"
          />
        </span>

        <div class="flex justify-center items-center mb-2 mt-auto md:text-sm text-xs ">
          <button
            @click="openModalCart(item)"
            class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          >
            <ShoppingCartIcon class="md:h-4 h-3 md:w-4 h-3" />
            Add to cart
          </button>
        </div>

        <ModalCart :product="productSelected" :open="modalCart" @close="modalCart = false" />
      </article>
    </div>

    <!-- PAGINATION -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6  text-white">
      <div class="text-sm font-semibold">
        Page <span class="font-bold">{{ pagination.page }}</span> of
        <span class="font-bold">{{ totalPages }}</span>
      </div>

      <div class="flex items-center gap-2 flex-wrap justify-center">
        <button
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="prevPage"
          :disabled="pagination.page === 1"
          :class="pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          type="button"
        >
          Prev
        </button>

        <button
          v-for="p in pageNumbers"
          :key="`page-${p}`"
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="goToPage(p)"
          :class="p === pagination.page ? 'bg-[var(--color-base)]' : ''"
          type="button"
        >
          {{ p }}
        </button>

        <button
          class="btn__base_3 border-2 border-[var(--color-dark)] cursor-pointer"
          @click="nextPage"
          :disabled="pagination.page === totalPages"
          :class="pagination.page === totalPages ? 'opacity-50 cursor-not-allowed' : ''"
          type="button"
        >
          Next
        </button>
      </div>
    </div>

    <p v-if="filteredItems.length === 0" class="mt-6 font-semibold">
      No products found with the selected filters.
    </p>
  </section>

  <p v-if="errorHandler" class="text-white md:p-3 p-2">Failed to load products. Please try again.</p>
</template>