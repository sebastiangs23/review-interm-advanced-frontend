<script setup lang="ts">
import { computed, ref } from "vue";

import Title from "../../components/Title.vue";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

definePageMeta({
  layout: "modules",
});

echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

type ChartType = "line" | "bar" | "pie";

const types: Array<{ key: ChartType; label: string }> = [
  { key: "bar", label: "Bar" },
  { key: "line", label: "Line" },
  { key: "pie", label: "Donut" },
];

const chartType = ref<ChartType>("bar");
const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const values = [120, 200, 150, 80, 70, 110, 160];

const pieData = computed(() =>
  categories.map((name, i) => ({ name, value: values[i] })),
);

const option = computed(() => {
  if (chartType.value === "line") {
    return {
      tooltip: { trigger: "axis" as const },
      grid: { left: 32, right: 16, top: 16, bottom: 28, containLabel: true },
      xAxis: { type: "category" as const, data: categories },
      yAxis: { type: "value" as const },
      series: [
        {
          type: "line" as const,
          data: values,
          smooth: true,
          areaStyle: {},
          itemStyle: { color: "#abf600" },
        },
      ],
    };
  }

  if (chartType.value === "bar") {
    return {
      tooltip: { trigger: "axis" as const },
      grid: { left: 32, right: 16, top: 16, bottom: 28, containLabel: true },
      xAxis: { type: "category" as const, data: categories },
      yAxis: { type: "value" as const },
      series: [
        {
          type: "bar" as const,
          data: values,
          barMaxWidth: 36,
          itemStyle: { color: "#abf600" },
        },
      ],
    };
  }

  // Donut chart
  return {
    tooltip: { trigger: "item" as const },
    legend: { top: 0, left: "center" as const },
    series: [
      {
        type: "pie" as const,
        radius: ["45%", "70%"],
        avoidLabelOverlap: true,
        label: { show: true, formatter: "{b}: {d}%" },
        data: pieData.value,
      },
    ],
  };
});
</script>

<template>
  <Title text="Dashboard" :size="1" />
  <div
    class="rounded-2xl border border-zinc-200 bg-[var(--bg-color-primary)] p-4 shadow-sm md:mt-2 mt-1"
  >
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h3 class="text-xl font-semibold text-white py-2">Just static data</h3>
        <p class="text-xs text-zinc-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga rerum
          repellat error mollitia, consectetur ex saepe pariatur ipsam magni
          minus commodi temporibus dolore sapiente tenetur, cumque ipsum,
          doloremque iure quidem!
        </p>
      </div>

      <!-- Segmented toggle -->
      <div class="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1">
        <button
          v-for="t in types"
          :key="t.key"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium transition"
          :class="
            chartType === t.key
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-700 hover:bg-white hover:text-zinc-900'
          "
          @click="chartType = t.key"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="mt-4">
      <ClientOnly>
        <VChart class="chart" :option="option" autoresize />
        <template #fallback>
          <div class="chart w-full animate-pulse" />
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.chart {
  height: 320px;
  width: 100%;
}
</style>
