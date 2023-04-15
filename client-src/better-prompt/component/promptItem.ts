import type {
  EmphasizedPrompt,
  ExtraNetworksPrompt,
  PlainPrompt,
  Prompt,
  ScheduledPrompt,
} from "@/libs/prompt";
import type { ExtraNetworksData, ExtraNetworksType } from "@/better-prompt";
import { promptToString } from "../common/prompt";
import { parsePrompt } from "@/libs/api";
import { getExtraNetworksData } from "@/better-prompt";

function _createPromptItem(prompt: string): HTMLElement {
  const item = document.createElement("li");
  item.classList.add("prompt-item");
  item.dataset.prompt = prompt;
  item.textContent = prompt.replaceAll("\\(", "(").replaceAll("\\)", ")");
  return item;
}

export function createPromptItem(prompt: Prompt): HTMLElement | null {
  switch (prompt.type) {
    case "plain":
      return createPlainItem(prompt);
    case "emphasized":
      return createEmphasizedItem(prompt);
    case "scheduled":
      return createScheduledItem(prompt);
    case "extranetworks":
      return _createExtraNetworksItem(prompt);
  }
  return null;
}

export function createPlainItem(prompt: PlainPrompt): HTMLElement;
export function createPlainItem(prompt: string): HTMLElement;
export function createPlainItem(prompt: PlainPrompt | string): HTMLElement {
  const stringPrompt = typeof prompt === "string" ? prompt : promptToString(prompt);
  const item = _createPromptItem(stringPrompt);
  item.dataset.type = "plain";
  return item;
}

function createEmphasizedItem(prompt: EmphasizedPrompt): HTMLElement {
  const item = _createPromptItem(promptToString(prompt));
  item.dataset.type = "emphasized";
  return item;
}

function createScheduledItem(prompt: ScheduledPrompt): HTMLElement {
  const item = _createPromptItem(promptToString(prompt));
  item.dataset.type = "scheduled";
  return item;
}

function _createExtraNetworksItem(prompt: ExtraNetworksPrompt): HTMLElement {
  const item = _createPromptItem(promptToString(prompt));
  item.dataset.type = "extranetworks";
  item.dataset.subtype = prompt.args[0].toLowerCase();
  if (prompt.args.length > 1) {
    item.dataset.filename = prompt.args[1];
  }
  item.textContent = `${prompt.args[1]}: ${prompt.args[2] || "1.00"}`;
  return item;
}

export function createExtraNetworksItem(
  type: ExtraNetworksType,
  data: ExtraNetworksData
): HTMLElement {
  let prompt: string;
  let text: string;
  if (type === "textual-inversion") {
    prompt = data.name;
    text = data.name;
  } else {
    prompt = `<${type}:${data.name}`;
    if (type === "lora") {
      prompt += ":1.0";
    }
    prompt += ">";
    text = `${data.name}: 1.00`;
  }
  const item = _createPromptItem(prompt);
  item.dataset.type = "extranetworks";
  item.dataset.subtype = type;
  item.dataset.filename = data.name;
  item.textContent = text;
  return item;
}

export function parsePromptItem(
  tabName: PromptAvailableTab,
  prompt: string
): Promise<HTMLElement[]> {
  return parsePrompt(prompt).then((parseResult) => {
    const items: HTMLElement[] = [];
    parseResult.forEach((prompt) => {
      const stringPrompt = promptToString(prompt).replaceAll("\\", "");
      if (stringPrompt.trim().length === 0) return;

      const list = getExtraNetworksData(tabName, "textual-inversion");
      const data = list.find((data) => data.name === stringPrompt);
      if (data != null) {
        items.push(createExtraNetworksItem("textual-inversion", data));
        return;
      }

      const item = createPromptItem(prompt);
      if (item != null) {
        items.push(item);
      }
    });
    return items;
  });
}
