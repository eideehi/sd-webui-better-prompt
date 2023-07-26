import type { Prompt } from "#/prompt";
import type { Writable } from "svelte/store";
import { isEquals } from "#/prompt";

class History<T> {
  private readonly history: T[] = [];
  private index = -1;

  constructor(private readonly maxLength: number) {}

  get current(): Nullable<T> {
    if (this.index < 0 || this.index >= this.history.length) return null;
    return this.history[this.index];
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.history.length - 1;
  }

  undo(): Nullable<T> {
    if (!this.canUndo) return null;
    this.index--;
    return this.current;
  }

  redo(): Nullable<T> {
    if (!this.canRedo) return null;
    this.index++;
    return this.current;
  }

  push(value: T): void {
    if (this.index === this.maxLength - 1) {
      this.history.shift();
    } else {
      this.history.splice(this.index + 1, this.history.length - this.index - 1);
      this.index++;
    }

    this.history.push(value);
  }
}

type PromptHistory = {
  type: "positive" | "negative";
  values: Prompt[];
};

const promptHistory = new History<PromptHistory>(40);

let positive: Nullable<Writable<Prompt[]>> = null;
let negative: Nullable<Writable<Prompt[]>> = null;
let skipUpdate = false;

export function initUndoRedo(args: {
  positive: Writable<Prompt[]>;
  negative: Writable<Prompt[]>;
}): void {
  ({ positive, negative } = args);

  let cachedPositive: Nullable<Prompt[]> = null;
  positive.subscribe((prompts) => {
    if (skipUpdate) return;
    if (cachedPositive == null) {
      cachedPositive = [];
      promptHistory.push({ type: "positive", values: [] });
    }

    if (isEquals(cachedPositive, prompts)) return;
    cachedPositive = prompts;

    promptHistory.push({ type: "positive", values: [...prompts] });
  });

  let cachedNegative: Nullable<Prompt[]> = null;
  negative.subscribe((prompts) => {
    if (skipUpdate) return;
    if (cachedNegative == null) {
      cachedNegative = [];
      promptHistory.push({ type: "negative", values: [] });
    }

    if (isEquals(cachedNegative, prompts)) return;
    cachedNegative = prompts;

    promptHistory.push({ type: "negative", values: prompts });
  });
}

export function undoRedo(event: KeyboardEvent): void {
  if (positive == null || negative == null) return;

  const { target, ctrlKey, metaKey, key } = event;
  if (target instanceof HTMLInputElement) {
    if (target.type === "text") return;
    if (target.type === "number") return;
  }
  if (target instanceof HTMLTextAreaElement) return;

  if (!ctrlKey && !metaKey) return;
  if (key !== "z" && key !== "y") return;

  event.preventDefault();

  const undo = event.key === "z";
  const history = undo ? promptHistory.undo() : promptHistory.redo();
  if (history == null) return;

  skipUpdate = true;
  (history.type === "positive" ? positive : negative).set(history.values);
  skipUpdate = false;
}
