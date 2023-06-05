import type { Readable, Writable } from "svelte/store";
import type { ExtraNetworksData } from "@/libs/extra-networks";
import type { Prompt } from "@/libs/prompt";

export type BetterPromptContext = {
  tabName: ExtensionAvailableTab;
  prompts: {
    positive: Writable<Prompt[]>;
    negative: Writable<Prompt[]>;
  };
  extraNetworksData: {
    lora: Readable<ExtraNetworksData[]>;
    textualInversion: Readable<ExtraNetworksData[]>;
  };
};

export const betterPromptContextKey = Symbol();
