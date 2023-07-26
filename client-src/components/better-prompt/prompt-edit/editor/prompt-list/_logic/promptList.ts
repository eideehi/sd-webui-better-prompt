import type { Prompt, ScheduledPrompt } from "#/prompt";
import { toString } from "#/prompt";
import { purgeEmphasizedPrompt } from "@/prompt-edit/_logic/purgeEmphasizedPrompt";

export function promptIdentifier(index: number, prompt: Prompt): string {
  switch (prompt.type) {
    case "alternate":
    case "combination":
    case "plain":
      return `${index}:${toString(prompt)}`;
    case "extra-networks":
      if (prompt.name !== "lora") return `${index}:${prompt.name}`;
      return `${index}:${prompt.name}:${prompt.args[0]}`;
    case "emphasized-positive":
    case "emphasized-negative":
      return `${index}:${toString(purgeEmphasizedPrompt(prompt))}`;
    case "emphasized-weighted":
      return `${index}:${toString(prompt.values)}`;
    case "scheduled":
      return scheduledIdentifier(index, prompt);
  }
}

function scheduledIdentifier(index: number, prompt: ScheduledPrompt): string {
  let buffer = "";
  if (prompt.from != null) {
    buffer += `:${toString(prompt.from)}`;
  }
  if (prompt.to != null) {
    buffer += `:${toString(prompt.to)}`;
  }
  return `${index}${buffer}`;
}
