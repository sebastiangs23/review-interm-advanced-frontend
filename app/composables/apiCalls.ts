import { ref, shallowRef, onUnmounted } from "vue";
import axios, { type AxiosRequestConfig, type AxiosError } from "axios";

type UseApiCallOptions<T> = {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
};

export function useApiCall<T = unknown>(
  requestFactory: () => AxiosRequestConfig,
  options: UseApiCallOptions<T> = {}
) {
  const data = shallowRef<T | null>(null);
  const error = ref<AxiosError | null>(null);
  const loading = ref(false);

  let controller: AbortController | null = null;

  const cancel = () => {
    if (controller) controller.abort();
    controller = null;
  };

  const execute = async () => {
    cancel(); // cancel previous request if any
    controller = new AbortController();

    loading.value = true;
    error.value = null;

    try {
      const config = requestFactory();
      const res = await axios.request<T>({
        ...config,
        signal: controller.signal,
      });

      data.value = res.data;
      options.onSuccess?.(res.data);
      return res.data;
    } catch (e) {
      // If it was cancelled, don’t treat as a real error
      if (axios.isCancel?.(e)) return;

      const err = e as AxiosError;
      // AbortController throws DOMException in some cases, ignore it if aborted
      if ((err as any)?.name === "CanceledError") return;

      error.value = err;
      options.onError?.(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  onUnmounted(() => cancel());

  if (options.immediate) {
    // fire and forget; user can still await execute if they want
    execute();
  }

  return {
    data,
    error,
    loading,
    execute,
    cancel,
  };
}
