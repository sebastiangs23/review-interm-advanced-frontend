<script setup>
// const config = useRuntimeConfig()

definePageMeta({
  layout: 'modules'
})

import { ref } from "vue"

const items = ref([]);

const getItems = async() => {
  try{
    const response = await $fetch("https://fakestoreapi.com/products")

    items.value = response;
  }catch(error){
    console.log(error)
  }
}

onMounted(() => {
  getItems()
})

</script>

<template>
  <h2 class="store-title">Store</h2>

  <section class="store">
    <div class="store-grid">
      <article v-for="item in items" :key="item.id" class="store-item">
        <div class="store-item__image-wrapper">
          <img :src="item.image" :alt="item.title" />
        </div>

        <h3 class="store-item__title">{{ item.title }}</h3>
        <p class="store-item__price">${{ item.price }}</p>

        <button class="store-item__button">
          Add to cart
        </button>
      </article>
    </div>
  </section>
</template>


<style scoped>
.store-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.store {
  padding: 1rem;
}

.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.store-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.store-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.store-item__image-wrapper {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin-bottom: 1rem;
}

.store-item__image-wrapper img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.store-item__title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.store-item__price {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.store-item__button {
  margin-top: auto;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.store-item__button:hover {
  background: #333;
}

</style>