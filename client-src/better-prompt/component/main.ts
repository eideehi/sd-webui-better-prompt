import { getElement } from "@/libs/dom";
import { createPromptComponent } from "./prompt-component";
import { createInputComponent } from "./input-component";

export function createMainComponents(tabName: PromptAvailableTab): void {
  if (getElement(`#better-prompt-${tabName}-components`) != null) return;

  const components = document.createElement("div");
  components.id = `better-prompt-${tabName}-components`;
  components.classList.add("better-prompt", "components", "gradio-row", "unequal-height");
  components.appendChild(createPromptComponent(tabName));
  components.appendChild(createInputComponent(tabName));
  getElement(`#${tabName}_toprow`)?.insertAdjacentElement("afterend", components);

  //TODO: Consider the layout when the original comtents is hidden.
  // withBooleanOption("better_prompt_hide_original_prompt", (value) => {});
}
