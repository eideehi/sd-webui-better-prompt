import type { Readable } from "@/libs/store";
import { getElement, getElementAll, hasElement } from "@/libs/dom";
import { createEmptyStore } from "@/libs/store";
import { generateHashCode } from "@/libs/string";
import Fuse from "fuse.js";

export type ExtraNetworksType = "textual-inversion" | "lora";

export type ExtraNetworksData = {
  type: ExtraNetworksType;
  name: string;
  search_term: string;
  thumbnail?: string;
};

type ExtraNetworksDataMap = Record<
  PromptAvailableTab,
  Partial<Record<ExtraNetworksType, ExtraNetworksData[]>>
>;

type ExtraNetworksDataFuseMap = Record<
  PromptAvailableTab,
  Partial<Record<ExtraNetworksType, Fuse<ExtraNetworksData>>>
>;

const _extraNetworksDataMap: Partial<ExtraNetworksDataMap> = {};
const _extraNetworksDataFuseMap: Partial<ExtraNetworksDataFuseMap> = {};

function createExtraNetworksDataFuse(data?: ExtraNetworksData[]): Fuse<ExtraNetworksData> {
  return new Fuse(data || [], {
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ["name", "search_term"],
  });
}

export function getExtraNetworksData(
  tabName: PromptAvailableTab,
  type: ExtraNetworksType
): ExtraNetworksData[] {
  const dataMap = _extraNetworksDataMap[tabName];
  return dataMap != null ? dataMap[type] || [] : [];
}

export function getExtraNetworksDataFuse(
  tabName: PromptAvailableTab,
  type: ExtraNetworksType
): Fuse<ExtraNetworksData> {
  const fuseMap = _extraNetworksDataFuseMap[tabName];
  if (fuseMap == null) {
    return createExtraNetworksDataFuse([]);
  }
  const fuse = fuseMap[type];
  return fuse != null ? fuse : createExtraNetworksDataFuse([]);
}

export function initExtraNetworksData(tabName: PromptAvailableTab): void {
  const textualInversion = getTextualInversion(tabName);
  const updateTextualInversion = updateExtraNetworksData(tabName, "textual-inversion");
  textualInversion.with(updateTextualInversion);
  textualInversion.subscribe(updateTextualInversion);

  const updateLora = updateExtraNetworksData(tabName, "lora");
  const lora = getLora(tabName);
  lora.with(updateLora);
  lora.subscribe(updateLora);
}

function updateExtraNetworksData(
  tabName: PromptAvailableTab,
  type: ExtraNetworksType
): (value: ExtraNetworksData[]) => void {
  return (value) => {
    let dataMap = _extraNetworksDataMap[tabName];
    if (dataMap == null) {
      dataMap = {};
      _extraNetworksDataMap[tabName] = dataMap;
    }
    dataMap[type] = [...value];

    let fuseMap = _extraNetworksDataFuseMap[tabName];
    if (fuseMap == null) {
      fuseMap = {};
      _extraNetworksDataFuseMap[tabName] = fuseMap;
    }
    fuseMap[type] = createExtraNetworksDataFuse(dataMap[type]);
  };
}

function getTextualInversion(tabName: PromptAvailableTab): Readable<ExtraNetworksData[]> {
  return createReadable(`#${tabName}_textual_inversion_cards`, "textual-inversion");
}

function getLora(tabName: PromptAvailableTab): Readable<ExtraNetworksData[]> {
  return createReadable(`#${tabName}_lora_cards`, "lora");
}

function createReadable(selector: string, type: ExtraNetworksType): Readable<ExtraNetworksData[]> {
  if (!hasElement(selector)) {
    return createEmptyStore();
  }

  const orDefault = (v: ExtraNetworksData[] | null, d: ExtraNetworksData[]) =>
    v == null || v.length === 0 ? d : v;
  const listeners: Array<(v: ExtraNetworksData[]) => void> = [];
  let values: ExtraNetworksData[] = [];

  const readable: Readable<ExtraNetworksData[]> = {
    read: () => values,
    readOrDefault: (defaultValue) => orDefault(values, defaultValue),
    with: (callback) => callback(orDefault(values, [])),
    subscribe: (callback) => listeners.push(callback),
  };

  const update = () => {
    const cards = getElementAll(`${selector} > .card`);
    values = cards.map((card) => {
      const name = getElement(card, ".actions > .name")?.textContent || "";
      const search_term =
        getElement(card, ".actions > .additional > .search_term")?.textContent || "";
      const thumbnail = card.style.backgroundImage.trim();
      return thumbnail.length === 0
        ? { type, name, search_term }
        : { type, name, search_term, thumbnail };
    });
    listeners.forEach((listener) => listener(values));
  };

  let hash = 0;
  const checkForElementUpdates = () => {
    const element = getElement(selector);
    if (element) {
      const newHash = generateHashCode(element.innerHTML);
      if (hash != newHash) {
        hash = newHash;
        update();
      }
    }
    window.setTimeout(checkForElementUpdates, 1000);
  };
  checkForElementUpdates();

  return readable;
}
