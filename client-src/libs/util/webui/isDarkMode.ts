import { hasElement } from "@/libs/util/dom";

export function isDarkMode(): boolean {
  return hasElement(".gradio-container.dark");
}
