import { negativePrompt, prompt } from "@/better-prompt/common/webui";

class PromptHistory {
  private readonly history: string[] = [];
  private index = -1;

  constructor(private readonly maxLength: number) {}

  get current(): string {
    return this.history[this.index];
  }

  get canUndo(): boolean {
    return this.index > 0;
  }

  get canRedo(): boolean {
    return this.index < this.history.length - 1;
  }

  undo(): Nullable<string> {
    if (!this.canUndo) return null;
    this.index--;
    return this.current;
  }

  redo(): Nullable<string> {
    if (!this.canRedo) return null;
    this.index++;
    return this.current;
  }

  push(value: string): void {
    if (this.index === this.maxLength - 1) {
      this.history.shift();
    } else {
      this.history.splice(this.index + 1, this.history.length - this.index - 1);
      this.index++;
    }

    this.history.push(value);
  }
}

function isBetterPromptElement(element: Nullable<Element>): boolean {
  if (element == null) return false;
  if (element.classList.contains("better-prompt")) return true;
  let node = element.parentNode;
  while (node != null) {
    if (node instanceof Element && node.classList.contains("better-prompt")) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function initUndoRedo(tabName: PromptAvailableTab): void {
  let lastOperatedPrompt: "positive" | "negative" = "positive";

  const positiveStore = prompt(tabName);
  const positiveHistory = new PromptHistory(20);
  let positiveLastUpdate = 0;
  positiveStore.subscribe((value) => {
    const now = Date.now();
    if (now - positiveLastUpdate >= 100) {
      positiveHistory.push(value);
      positiveLastUpdate = now;
      lastOperatedPrompt = "positive";
    }
  });

  const negativeStore = negativePrompt(tabName);
  const negativeHistory = new PromptHistory(20);
  let negativeLastUpdate = 0;
  negativeStore.subscribe((value) => {
    const now = Date.now();
    if (now - negativeLastUpdate >= 100) {
      negativeHistory.push(value);
      negativeLastUpdate = now;
      lastOperatedPrompt = "negative";
    }
  });

  positiveHistory.push("");
  negativeHistory.push("");

  let lastFocus: Nullable<Element> = null;
  document.addEventListener("focusin", (event) => {
    if (!(event.target instanceof Element)) return;
    lastFocus = event.target;
  });
  document.addEventListener("keydown", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    if (event.key !== "z" && event.key !== "y") return;
    if (isBetterPromptElement(lastFocus)) {
      event.preventDefault();
    }

    const toPositive = lastOperatedPrompt === "positive";
    const history = toPositive ? positiveHistory : negativeHistory;
    const store = toPositive ? positiveStore : negativeStore;

    const undo = event.key === "z";
    if (undo && !history.canUndo) return;
    if (!undo && !history.canRedo) return;

    const value = undo ? history.undo() : history.redo();
    if (value == null) return;

    positiveLastUpdate = negativeLastUpdate = Date.now();
    store.write(value);
  });
}
