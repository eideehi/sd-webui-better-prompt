import type { Direction2D } from "@/libs/dom";
import type { ExtraNetworksData } from "@/better-prompt";
import type { FilterType } from "./filter";
import {
  addClasses,
  getElement,
  getElementAll,
  getNextElementInDirection,
  removeAllChild,
  removeClasses,
} from "@/libs/dom";
import { dispatchEvent } from "@/libs/webui";
import { showPopupBelow } from "@/libs/popup";
import { getExtraNetworksDataFuse, getDanbooruTagFuse } from "@/better-prompt";
import { createExtraNetworksItem, createPlainItem, parsePromptItem } from "../promptItem";
import { appendPromptItem } from "../prompt-component/promptList";
import { getFilterTypes } from "./filter";
import { nanoid } from "nanoid";

export function createSuggestComponent(
  tabName: PromptAvailableTab,
  input: HTMLInputElement,
  filter: HTMLElement
): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.classList.add("suggest-wrapper");

  const suggestList = document.createElement("ul");
  suggestList.classList.add("suggest", "prompt-list");
  wrapper.appendChild(suggestList);

  let pseudoFocusIndex = -1;

  const doUpdateSuggest = () => {
    pseudoFocusIndex = -1;
    updateSuggest(suggestList, {
      tabName,
      keyword: input.value,
      filter: new Set(getFilterTypes(filter)),
    });
  };

  let timer = -1;
  const delayUpdate = (delay: number) => () => {
    if (timer > -1) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(doUpdateSuggest, delay);
  };

  input.addEventListener("input", delayUpdate(250));
  input.addEventListener("focusin", () => {
    if (input.value.length > 0) {
      input.selectionStart = 0;
      input.selectionEnd = input.value.length;
    }
  });

  const clearPseudoFocus = () => {
    getElementAll(suggestList, ".prompt-item.pseudo-focus").forEach((value) => {
      removeClasses(value, "pseudo-focus");
    });
  };

  input.addEventListener("focusout", () => {
    pseudoFocusIndex = -1;
    clearPseudoFocus();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      pseudoFocusIndex = -1;
      clearPseudoFocus();
      return;
    } else if (event.key !== "Tab") {
      const focused = getElement(suggestList, ".prompt-item.pseudo-focus");
      if (focused == null) return;

      const moveFocus = (direction: Direction2D) => {
        event.preventDefault();
        event.stopPropagation();
        const next = getNextElementInDirection(focused, direction);
        if (next) {
          removeClasses(focused, "pseudo-focus");
          addClasses(next, "pseudo-focus");
          pseudoFocusIndex = getElementAll(suggestList, ".prompt-item").indexOf(next);
        }
      };

      switch (event.key) {
        case "ArrowDown":
          moveFocus("down");
          break;
        case "ArrowUp":
          moveFocus("up");
          break;
        case "ArrowRight":
          moveFocus("right");
          break;
        case "ArrowLeft":
          moveFocus("left");
          break;
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const items = getElementAll(suggestList, ".prompt-item");
    if (items.length === 0) return;

    pseudoFocusIndex += event.shiftKey ? -1 : 1;
    if (pseudoFocusIndex < 0) {
      pseudoFocusIndex = items.length - 1;
    } else if (pseudoFocusIndex >= items.length) {
      pseudoFocusIndex = 0;
    }

    clearPseudoFocus();
    addClasses(items[pseudoFocusIndex], "pseudo-focus");
  });

  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      const item = getElement(suggestList, ".prompt-item.pseudo-focus");
      if (item != null) {
        item.dispatchEvent(new MouseEvent("click", { button: 0, shiftKey: event.shiftKey }));
      } else {
        parsePromptItem(tabName, input.value).then((items) => {
          items.forEach((item) => appendPromptItem(tabName, !event.shiftKey, item));
        });
      }

      input.value = "";
      dispatchEvent(input, "input");
    }
  });

  filter.addEventListener("update-filter", () => {
    doUpdateSuggest();
  });

  return wrapper;
}

function updateSuggest(
  results: HTMLElement,
  options: {
    tabName: PromptAvailableTab;
    keyword: string;
    filter: Set<FilterType>;
  }
): void {
  const { tabName, keyword, filter } = options;
  const isNotFiltered = (type: FilterType) => filter.has("all") || filter.has(type);

  removeAllChild(results);

  const limit = 20;
  let count = 0;
  const withinLimit = () => count < limit;

  if (withinLimit() && isNotFiltered("textual-inversion")) {
    const fuse = getExtraNetworksDataFuse(tabName, "textual-inversion");
    fuse.search(keyword, { limit: limit - count }).forEach((result) => {
      results.appendChild(createExtraNetworksButton(tabName, result.item));
      count++;
    });
  }

  if (withinLimit() && isNotFiltered("lora")) {
    const fuse = getExtraNetworksDataFuse(tabName, "lora");
    fuse.search(keyword, { limit: limit - count }).forEach((value) => {
      results.appendChild(createExtraNetworksButton(tabName, value.item));
      count++;
    });
  }

  if (withinLimit() && isNotFiltered("danbooru-general")) {
    const fuse = getDanbooruTagFuse("general");
    fuse.search(keyword, { limit: limit - count }).forEach((value) => {
      results.appendChild(createDanbooruButton(tabName, value.item));
      count++;
    });
  }

  if (withinLimit() && isNotFiltered("danbooru-character")) {
    const fuse = getDanbooruTagFuse("character");
    fuse.search(keyword, { limit: limit - count }).forEach((value) => {
      results.appendChild(createDanbooruButton(tabName, value.item));
      count++;
    });
  }

  if (withinLimit() && isNotFiltered("danbooru-copyright")) {
    const fuse = getDanbooruTagFuse("copyright");
    fuse.search(keyword, { limit: limit - count }).forEach((value) => {
      results.appendChild(createDanbooruButton(tabName, value.item));
      count++;
    });
  }
}

function createExtraNetworksButton(
  tabName: PromptAvailableTab,
  data: ExtraNetworksData
): HTMLElement {
  const { type, name, thumbnail } = data;

  const button = document.createElement("button");
  button.classList.add("prompt-item");
  button.dataset.type = "extranetworks";
  button.dataset.subtype = type;
  button.textContent = name;

  const createThumbnailPreview = () => {
    const thumbnailPreview = document.createElement("div");
    thumbnailPreview.classList.add("thumbnail-preview", "extra-network-cards");

    const card = document.createElement("div");
    card.classList.add("card");
    if (thumbnail != null) {
      card.style.backgroundImage = thumbnail;
    }

    if (type === "lora") {
      const metadataButton = document.createElement("div");
      metadataButton.classList.add("metadata-button");
      metadataButton.addEventListener("click", (event) => {
        extraNetworksRequestMetadata(event, type, name);
      });
      card.appendChild(metadataButton);
    }

    thumbnailPreview.appendChild(card);
    return thumbnailPreview;
  };

  button.addEventListener("click", (event) => {
    if (event.button === 0) {
      appendPromptItem(tabName, !event.shiftKey, createExtraNetworksItem(type, data));
    }
  });
  const popupId = `thumbnail-preview-${nanoid()}`;
  button.addEventListener("contextmenu", (event) => {
    showPopupBelow(button, {
      id: popupId,
      contentFactory: () => {
        event.preventDefault();
        return createThumbnailPreview();
      },
      groupToClose: "thumbnail-preview",
    });
  });
  return button;
}

function createDanbooruButton(tabName: PromptAvailableTab, tag: DanbooruTag): HTMLElement {
  const toPrompt = (tag: DanbooruTag) => {
    return tag.name.replaceAll("_", " ").replaceAll("(", "\\(").replaceAll(")", "\\)");
  };
  const toLabel = (tag: DanbooruTag) => {
    return `${tag.name.replaceAll("_", " ")}`;
  };
  const toCount = (tag: DanbooruTag) => {
    let count = tag.post_count;
    if (count >= 1000000) {
      count /= 1000000;
      const str = count.toFixed(count < 10.0 ? 1 : 0);
      return `${str}M`;
    } else if (count >= 1000) {
      count /= 1000;
      const str = count.toFixed(count < 10.0 ? 1 : 0);
      return `${str}k`;
    } else {
      return count.toString();
    }
  };

  const button = document.createElement("button");
  button.classList.add("prompt-item");
  button.dataset.type = "danbooru";
  button.dataset.category = tag.category.toString();

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = toLabel(tag);
  button.appendChild(label);

  const count = document.createElement("span");
  count.classList.add("count");
  count.textContent = toCount(tag);
  button.appendChild(count);

  const prompt = toPrompt(tag);
  button.addEventListener("click", (event) => {
    if (event.button === 0) {
      appendPromptItem(tabName, !event.shiftKey, createPlainItem(prompt));
    }
  });
  return button;
}
