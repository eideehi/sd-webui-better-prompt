import { createEmptyStore, createStore, Store } from "@/libs/store";
import { getElement } from "@/libs/dom";
import { _, dispatchEvent } from "@/libs/webui";
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

function prompt(tabName: PromptAvailableTab): Store<string> {
  return createTextAreaStore(`#${tabName}_prompt textarea`);
}

function negativePrompt(tabName: PromptAvailableTab): Store<string> {
  return createTextAreaStore(`#${tabName}_neg_prompt textarea`);
}

function createTextAreaStore(selector: string): Store<string> {
  const element = getElement(selector);
  if (!(element instanceof HTMLTextAreaElement)) {
    return createEmptyStore();
  }

  const store = createStore({
    read: () => element.value,
    write: (value) => {
      if (element.value !== value) {
        element.value = value;
        dispatchEvent(element, "input");
      }
      return true;
    },
  });

  let valueCache = "";

  element.addEventListener("input", () => {
    valueCache = element.value;
    store.write(element.value);
  });

  const checkForPromptClear = () => {
    const newValue = element.value;
    if (valueCache != newValue && newValue.length === 0) {
      valueCache = newValue;
      dispatchEvent(element, "input");
    }
    window.setTimeout(checkForPromptClear, 500);
  };
  checkForPromptClear();

  return store;
}
