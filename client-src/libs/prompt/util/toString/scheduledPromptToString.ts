import type { ScheduledPrompt } from "#/prompt";
import { toString } from "./index";

export function scheduledPromptToString(prompt: ScheduledPrompt): string {
  let buffer = "";
  if (prompt.from != null) {
    buffer += `${toString(prompt.from)}:`;
  }
  if (prompt.to != null) {
    buffer += toString(prompt.to);
  }
  buffer += `:${prompt.when}`;
  return `[${buffer}]`;
}
