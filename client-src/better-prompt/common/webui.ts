import { createEmptyStore, createStore, Store } from "@/libs/store";
import { getElement } from "@/libs/dom";
import { dispatchEvent } from "@/libs/webui";

const _promptMap: Partial<Record<PromptAvailableTab, Store<string>>> = {};
const _negativePromptMap: Partial<Record<PromptAvailableTab, Store<string>>> = {};

export function prompt(tabName: PromptAvailableTab): Store<string> {
  const store = _promptMap[tabName];
  if (store != null) return store;
  return (_promptMap[tabName] = createTextAreaStore(`#${tabName}_prompt textarea`));
}

export function negativePrompt(tabName: PromptAvailableTab): Store<string> {
  const store = _negativePromptMap[tabName];
  if (store != null) return store;
  return (_negativePromptMap[tabName] = createTextAreaStore(`#${tabName}_neg_prompt textarea`));
}

function createTextAreaStore(selector: string): Store<string> {
  const element = getElement(selector);
  if (!(element instanceof HTMLTextAreaElement)) {
    console.error(`Failed to get element: ${selector}`);
    return createEmptyStore();
  }

  let valueCache = "";

  const store = createStore({
    read: () => element.value,
    write: (value) => {
      element.value = value;
      if (valueCache !== value) {
        valueCache = value;
        dispatchEvent(element, "input");
      }
      return true;
    },
  });

  element.addEventListener("input", () => {
    if (valueCache !== element.value) {
      store.write(element.value);
    }
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
