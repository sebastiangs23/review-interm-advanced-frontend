  <script setup lang="ts">

  const props = defineProps<{
    label: string;
    color: string;
    showHex?: boolean;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: object): void;
  }>();

  function onInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const data = {
      label: props.label,
      color: target.value
    };

    emit("update:modelValue", data);
  }
  </script>

  <template>
    <div class="flex flex-wrap items-center md:gap-[1rem] gap-[0.85rem] p-[0.5rem 0] text-white">
      <label class="md:text-lg text-xs" >{{ props.label }}</label>
      <input 
        type="color"
        @input="onInput"
        v-model="props.color"
      />

      <div
        :style="{ backgroundColor: props.color }"
      ></div>

      <span class="text-sm text-white/80" v-show="props.showHex">
        {{ props.color }}
      </span>
    </div>
  </template>