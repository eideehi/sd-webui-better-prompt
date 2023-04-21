import { _ } from "@/libs/webui";
import { prompt, negativePrompt } from "@/better-prompt/common/webui";
import { createPromptList } from "./promptList";
import { createTokenCounter } from "./tokenCounter";

export function createPromptComponent(tabName: PromptAvailableTab): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("prompt-component");
  container.appendChild(createPromptContainer(tabName, true));
  container.appendChild(createPromptContainer(tabName, false));
  return container;
}

function createPromptContainer(tabName: PromptAvailableTab, positive: boolean): HTMLElement {
  const name = _(positive ? "Prompt" : "Negative prompt");
  const prefix = `${tabName}${positive ? "" : "_negative"}`;
  const store = positive ? prompt(tabName) : negativePrompt(tabName);

  const container = document.createElement("div");
  container.classList.add("prompt-container");

  const label = document.createElement("span");
  label.textContent = _(name);
  container.appendChild(label);

  const wrapper = document.createElement("div");
  wrapper.classList.add("prompt-wrapper");
  container.appendChild(wrapper);

  const tokenCounter = createTokenCounter(`#${prefix}_token_counter > span`);
  wrapper.appendChild(tokenCounter);

  const promptList = createPromptList({
    tabName,
    positive,
    store,
  });
  wrapper.appendChild(promptList);

  return container;
}
