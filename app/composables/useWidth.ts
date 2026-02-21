import { ref, onMounted, onBeforeUnmount } from "vue";

export function useWindowWidth() {
  const width = ref<number>(0);

  const update = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", update);
  });

  return { width };
}