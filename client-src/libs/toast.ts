import { getElementAll } from "./util/dom";

export type ToastType = "info" | "success" | "warning" | "error";

export function showToast(
  message: string,
  type: ToastType = "info",
  options?: {
    duration?: number;
    align?: "left" | "center" | "right";
  }
): HTMLElement {
  const { duration, align } = Object.assign(
    {
      duration: 3000,
      align: "center",
    },
    options
  );

  getElementAll(`.better-prompt.toast.${align}`).forEach(closeToast);

  const toast = document.createElement("div");
  toast.classList.add("better-prompt", "toast", type, align);
  toast.textContent = message;

  let timer = -1;
  timer = window.setTimeout(() => {
    toast.classList.remove("fade-out");
    toast.classList.add("show");
    if (duration > 0) {
      timer = window.setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("fade-out");
        // Wait for css animation to complete
        timer = window.setTimeout(() => {
          closeToast(toast);
        }, 300);
      }, duration);
    }
  }, 50);

  toast.addEventListener("click", () => {
    closeToast(toast);
  });

  toast.addEventListener("close-toast", () => {
    if (timer >= 0) {
      window.clearTimeout(timer);
    }
    toast.remove();
  });

  gradioApp().appendChild(toast);
  return toast;
}

export function closeToast(toast: HTMLElement): void {
  toast.dispatchEvent(new CustomEvent("close-toast"));
}
