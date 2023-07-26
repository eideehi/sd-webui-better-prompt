import { hasElement } from "#/util/dom";

export function isDarkMode(): boolean {
  return hasElement(".gradio-container.dark");
}
