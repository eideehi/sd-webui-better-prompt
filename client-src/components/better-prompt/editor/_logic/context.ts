import type { Writable } from "svelte/types/runtime/store";
import type { Prompt } from "@/libs/prompt";

export type EditorContext = {
  negative: boolean;
  prompts: Writable<Prompt[]>;
};

export const editorContextKey = Symbol();
