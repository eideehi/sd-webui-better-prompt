import type { ExtraNetworksData } from "@/libs/extra-networks";
import { type Readable, writable } from "svelte/store";

const _lora = writable<ExtraNetworksData[]>([]);
export const lora: Readable<ExtraNetworksData[]> = { subscribe: _lora.subscribe };

const _textualInversion = writable<ExtraNetworksData[]>([]);
export const textualInversion: Readable<ExtraNetworksData[]> = {
  subscribe: _textualInversion.subscribe,
};

let loraInit = false;
let textualInversionInit = false;

export function initLora(tags: ExtraNetworksData[]): void {
  if (loraInit) return;
  loraInit = true;
  _lora.set(tags);
}

export function initTextualInversion(tags: ExtraNetworksData[]): void {
  if (textualInversionInit) return;
  textualInversionInit = true;
  _textualInversion.set(tags);
}
