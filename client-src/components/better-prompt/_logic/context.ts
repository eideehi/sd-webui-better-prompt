import type { Writable } from "svelte/store";
import type { Prompt } from "@/libs/prompt";

export type BetterPromptContext = {
  tabName: ExtensionAvailableTab;
  prompts: {
    positive: Writable<Prompt[]>;
    negative: Writable<Prompt[]>;
  };
};

export const betterPromptContextKey = Symbol();
