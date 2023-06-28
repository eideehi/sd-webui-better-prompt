import type { Writable } from "svelte/store";
import type { Prompt } from "@/libs/prompt";

export type EditorContext = {
  negative: boolean;
  prompts: Writable<Prompt[]>;
};

export const editorContextKey = Symbol();
