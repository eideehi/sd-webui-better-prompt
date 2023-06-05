import type { Writable } from "svelte/store";

export type PseudoFocusMoveDirection = "next" | "previous" | "up" | "down" | "right" | "left";

export type PromptInputContext = {
  pseudoFocus: Writable<number>;
  currentFocus: Writable<Nullable<HTMLElement>>;
  movePseudoFocus: Writable<Nullable<PseudoFocusMoveDirection>>;
};

export const promptInputContextKey = Symbol();
