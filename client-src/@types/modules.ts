declare module "%/Toast.svelte" {
  export { SvelteComponent as default } from "svelte";

  export type ToastType = "info" | "success" | "warning" | "error";

  export type ToastMessage = {
    type?: ToastType;
    text: string;
    duration?: number;
  };

  export function showToast(message: ToastMessage): void;
}
