<script setup lang="ts">
import Title from "../../components/Title.vue";

definePageMeta({
  layout: "modules",
});
</script>

<template>
  <div class="text-(--color-text-primary) space-y-4">
    <Title text="Amazon Web Services" :size="1" />
    <p>This is where I will use the ec2 instance, s3, etc.</p>
  </div>
</template>
