import type { ExtraNetworksData, ExtraNetworksType } from "@/libs/extra-networks";
import { type Readable, readable } from "svelte/store";
import { getElement, getElementAll } from "@/libs/util/dom";
import { generateHashCode } from "@/libs/util/string";

export function createLoraReadable(tabName: ExtensionAvailableTab): Readable<ExtraNetworksData[]> {
  return createReadable(`#${tabName}_lora_cards`, "lora");
}

export function createTextualInversionReadable(
  tabName: ExtensionAvailableTab
): Readable<ExtraNetworksData[]> {
  return createReadable(`#${tabName}_textual_inversion_cards`, "textual-inversion");
}

function createReadable(selector: string, type: ExtraNetworksType): Readable<ExtraNetworksData[]> {
  return readable<ExtraNetworksData[]>([], (set) => {
    let timeout: number;

    let currentHash = -1;
    const update = () => {
      const element = getElement(selector);
      if (element == null) {
        timeout = window.setTimeout(update, 1000);
        return;
      }

      const hash = generateHashCode(element.innerHTML);
      if (hash === currentHash) {
        timeout = window.setTimeout(update, 1000);
        return;
      }
      currentHash = hash;

      set(
        getElementAll(`${selector} > .card`).map((card) => {
          const name = getElement(card, ".actions > .name")?.textContent || "";
          const search_term =
            getElement(card, ".actions > .additional > .search_term")?.textContent || "";
          const thumbnail = card.style.backgroundImage.trim();
          return thumbnail.length === 0
            ? { type, name, search_term }
            : { type, name, search_term, thumbnail };
        })
      );
      timeout = window.setTimeout(update, 1000);
    };

    timeout = window.setTimeout(update, 0);
    return () => {
      window.clearTimeout(timeout);
    };
  });
}
