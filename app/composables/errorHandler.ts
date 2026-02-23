import { useNuxtApp } from "#app";

type ToastKind = "success" | "info" | "warning" | "error";

type HandlerOptions = {
  showToast?: boolean;           // default: true
  successMessage?: string;       // override msg for 2xx
  redirectMessage?: string;      // override msg for 3xx
  clientErrorMessage?: string;   // override msg for 4xx
  serverErrorMessage?: string;   // override msg for 5xx
};

export function useErrorHandler(status: number, message?: string, options: HandlerOptions = {}) {
  const { $toast } = useNuxtApp();

  const {
    showToast = true,
    successMessage,
    redirectMessage,
    clientErrorMessage,
    serverErrorMessage,
  } = options;

  const safeMsg = message?.trim();

  let ok = false;
  let kind: ToastKind = "info";
  let finalMessage = safeMsg || "Respuesta recibida.";

  // 2xx Success
  if (status >= 200 && status < 300) {
    ok = true;
    kind = "success";
    finalMessage = successMessage || safeMsg || "Acción realizada correctamente.";
  }
  // 3xx Redirect / Not modified
  else if (status >= 300 && status < 400) {
    ok = true; // normalmente no es error; depende de tu lógica
    kind = "info";
    finalMessage = redirectMessage || safeMsg || "Redirección / respuesta informativa.";
  }
  // 4xx Client error
  else if (status >= 400 && status < 500) {
    ok = false;
    kind = "warning";
    finalMessage = clientErrorMessage || safeMsg || "Solicitud inválida. Verifica los datos.";
  }
  // 5xx Server error
  else if (status >= 500 && status < 600) {
    ok = false;
    kind = "error";
    finalMessage = serverErrorMessage || safeMsg || "Error del servidor. Intenta más tarde.";
  }
  // Anything else
  else {
    ok = status >= 100 && status < 400;
    kind = ok ? "info" : "error";
    finalMessage = safeMsg || (ok ? "Operación completada." : "Ocurrió un error inesperado.");
  }

  if (showToast) {
    // Ajusta esto si tu plugin usa otra firma.
    if (kind === "success") $toast.success(finalMessage);
    else if (kind === "info") $toast.info?.(finalMessage) ?? $toast.success(finalMessage);
    else if (kind === "warning") $toast.warning?.(finalMessage) ?? $toast.error(finalMessage);
    else $toast.error(finalMessage);
  }

  return { ok, status, kind, message: finalMessage };
}