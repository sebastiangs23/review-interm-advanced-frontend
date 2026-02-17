import { defineNuxtPlugin } from "#app";
import VChart from "vue-echarts";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VChart", VChart);
});