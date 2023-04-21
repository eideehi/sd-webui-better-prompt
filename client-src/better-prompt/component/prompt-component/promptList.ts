import type { Store } from "@/libs/store";
import type { EmphasizedPrompt, ExtraNetworksPrompt, PlainPrompt, Prompt } from "@/libs/prompt";
import type { ExtraNetworksType } from "@/better-prompt";
import { parsePrompt } from "@/libs/api";
import { getElement, getElementAll, removeAllChild, hasClass } from "@/libs/dom";
import { closePopupById, showPopupBelow } from "@/libs/popup";
import { concatPrompt, isPromptType } from "@/libs/prompt";
import { showToast } from "@/libs/toast";
import { _ } from "@/libs/webui";
import { getExtraNetworksData } from "@/better-prompt";
import { createSlider } from "../../common/forms";
import { createPromptItem, parsePromptItem } from "../promptItem";
import Sortable from "sortablejs";
import { nanoid } from "nanoid";

function getPromptListId(tabName: PromptAvailableTab, positive: boolean): string {
  return `better-prompt-${tabName}${positive ? "" : "-negative"}-prompt`;
}

export function createPromptList(options: {
  tabName: PromptAvailableTab;
  positive: boolean;
  store: Store<string>;
}): HTMLElement {
  const { tabName, positive, store } = options;
  const list = document.createElement("ul");
  list.id = getPromptListId(tabName, positive);
  list.classList.add("prompt-list");
  if (!positive) {
    list.classList.add("negative");
  }

  let parseDisabled = false;
  new Sortable(list, {
    animation: 150,
    filter: "prompt-item",
    swapThreshold: 1.1,
    ghostClass: "ghost",
    onSort: () => {
      parseDisabled = true;
      store.write(itemsToPrompt(list));
      parseDisabled = false;
    },
  });

  list.addEventListener("update-list", () => {
    parseDisabled = true;
    store.write(itemsToPrompt(list));
    parseDisabled = false;
  });

  store.subscribe(async (prompt) => {
    if (!parseDisabled) {
      const items = await parsePromptItem(tabName, prompt);
      removeAllChild(list);
      items.forEach((item) => {
        itemValidation(tabName, item);
        _appendPromptItem(list, item, true);
      });
    }
  });

  return list;
}

function itemValidation(tabName: PromptAvailableTab, item: HTMLElement): void {
  const hasExtraNetworksData = (type: ExtraNetworksType) => {
    const list = getExtraNetworksData(tabName, type);
    return list.some((data) => data.name === item.dataset.filename);
  };
  const type = item.dataset.subtype || "";
  if ((type === "lora" || type === "textual-inversion") && !hasExtraNetworksData(type)) {
    item.dataset.invalid = "true";
  }
}

function _appendPromptItem(list: HTMLElement, item: HTMLElement, silent: boolean): void {
  if (item.dataset.subtype === "lora" && hasClass(list, "negative")) {
    showToast(_("LoRA cannot be add to negative prompt"), "error");
    return;
  }

  const notifyUpdate = () => list.dispatchEvent(new CustomEvent("update-list"));
  item.addEventListener("update-item", notifyUpdate);

  item.addEventListener("click", (event) => {
    if (event.shiftKey && event.button === 0) {
      event.preventDefault();
      event.stopPropagation();
      item.remove();
      notifyUpdate();
    }
  });

  const popupId = `prompt-item-${nanoid()}`;
  item.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;
    closePopupById(popupId);
  });
  item.addEventListener("contextmenu", async (event) => {
    const preventDefault = () => {
      if (event.ctrlKey) return; // For debug. When ctrl key pressed, context menu is displayed.
      event.preventDefault();
    };
    if (closePopupById(popupId)) {
      preventDefault();
    } else {
      showPopupBelow(item, {
        id: popupId,
        groupToClose: "prompt-item",
        contentFactory: async () => {
          preventDefault();
          return await createPopupForPromptItem(item);
        },
      });
    }
  });

  list.appendChild(item);
  if (!silent) {
    notifyUpdate();
  }
}

export function appendPromptItem(
  tabName: PromptAvailableTab,
  positive: boolean,
  item: HTMLElement,
  silent?: boolean
): void {
  const list = getElement(`#${getPromptListId(tabName, positive)}`);
  if (list != null) {
    itemValidation(tabName, item);
    _appendPromptItem(list, item, silent != null && silent);
  }
}

async function createPopupForPromptItem(item: HTMLElement): Promise<HTMLElement | null> {
  const type = item.dataset.type || "";
  if (!isPromptType(type)) {
    return null;
  }
  if (type === "scheduled" || (type === "extranetworks" && item.dataset.subtype !== "lora")) {
    return null;
  }

  const popup = document.createElement("div");
  const prompt = (await parsePrompt(item.dataset.prompt || ""))[0];
  switch (prompt.type) {
    case "plain":
      appendPopupContentForPlain(popup, item, prompt);
      break;
    case "emphasized":
      console.log(JSON.stringify(prompt));
      if (!prompt.values.reduce((x, y) => x && y.type === "plain", true)) {
        return null;
      }
      appendPopupContentForEmphasized(popup, item, prompt);
      break;
    case "scheduled":
      //TODO: Implement
      break;
    case "extranetworks":
      appendPopupContentForExtraNetworks(popup, item, prompt);
      break;
  }

  return popup;
}

function appendPopupContentForPlain(
  popup: HTMLElement,
  item: HTMLElement,
  prompt: PlainPrompt
): void {
  const { root } = createSlider(_("Multiplier"), {
    min: 0.05,
    max: 2,
    defaultValue: 1,
    inputStep: 0.01,
    sliderStep: 0.05,
    fractionDigits: 2,
  });

  root.addEventListener("slider-update", (event) => {
    if (event instanceof CustomEvent) {
      const valueAsNumber = Number(event.detail.valueAsNumber);
      if (Number.isNaN(valueAsNumber)) return;
      if (valueAsNumber !== 1) {
        onPromptUpdate(item, {
          type: "emphasized",
          negative: valueAsNumber < 0,
          values: [prompt],
          multiplier: valueAsNumber,
        });
      } else {
        onPromptUpdate(item, prompt);
      }
      item.dispatchEvent(new CustomEvent("update-item"));
    }
  });

  popup.appendChild(root);
}

function appendPopupContentForEmphasized(
  popup: HTMLElement,
  item: HTMLElement,
  prompt: EmphasizedPrompt
): void {
  const getMultiplier = (parent: EmphasizedPrompt, child: Prompt): number => {
    if (child.type === "plain" || child.type === "extranetworks" || child.type == "whitespace") {
      return 1;
    }
    if (child.type === "scheduled") {
      return 1;
    }
    if (child.multiplier != null) {
      return child.multiplier;
    }
    return (
      child.values.map((x) => getMultiplier(child, x)).reduce((x, y) => x * y) *
      (parent.negative ? 0.91 : 1.1)
    );
  };

  const { root } = createSlider(_("Multiplier"), {
    min: 0.05,
    max: 2,
    defaultValue: getMultiplier(prompt, prompt),
    inputStep: 0.01,
    sliderStep: 0.05,
    fractionDigits: 2,
  });

  root.addEventListener("slider-update", (event) => {
    if (event instanceof CustomEvent) {
      const valueAsNumber = Number(event.detail.valueAsNumber);
      if (Number.isNaN(valueAsNumber)) return;
      if (valueAsNumber === 1 && prompt.values.length === 1 && prompt.values[0].type === "plain") {
        onPromptUpdate(item, prompt.values[0]);
      } else {
        prompt.multiplier = valueAsNumber;
        onPromptUpdate(item, prompt);
      }

      item.dispatchEvent(new CustomEvent("update-item"));
    }
  });

  popup.appendChild(root);
}

function appendPopupContentForExtraNetworks(
  popup: HTMLElement,
  item: HTMLElement,
  prompt: ExtraNetworksPrompt
) {
  const { root } = createSlider(_("Multiplier"), {
    min: 0.05,
    max: 2,
    defaultValue: prompt.args.length > 2 ? prompt.args[2] : 1,
    inputStep: 0.01,
    sliderStep: 0.05,
    fractionDigits: 2,
  });

  root.addEventListener("slider-update", (event) => {
    if (event instanceof CustomEvent) {
      const valueAsNumber = Number(event.detail.valueAsNumber);
      if (Number.isNaN(valueAsNumber)) return;
      prompt.args[2] = event.detail.value;
      onPromptUpdate(item, prompt);
      item.dispatchEvent(new CustomEvent("update-item"));
    }
  });

  popup.appendChild(root);
}

function onPromptUpdate(item: HTMLElement, prompt: Prompt): void {
  const promptItem = createPromptItem(prompt);
  if (promptItem != null) {
    Object.keys(item.dataset).forEach((key) => delete item.dataset[key]);
    Object.assign(item.dataset, { ...promptItem.dataset });
    item.textContent = promptItem.textContent;
  }
}

function itemsToPrompt(list: HTMLElement): string {
  let prompt = "";
  let prevSubtype = "";

  getElementAll(list, ".prompt-item").forEach((item) => {
    const append = item.dataset.prompt || "";
    if (append.length > 0) {
      if (prevSubtype !== "lora") {
        prompt = concatPrompt(prompt, append);
      } else {
        prompt = `${prompt} ${append}`;
      }
      prevSubtype = item.dataset.subtype || "";
    }
  });

  return prompt;
}
