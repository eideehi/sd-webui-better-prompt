import type { ScheduledPrompt } from "#/prompt";
import { promptsToString } from "./promptsToString";

export function scheduledPromptToString(prompt: ScheduledPrompt): string {
  let buffer = "";
  if (prompt.from != null) {
    buffer += `${promptsToString(prompt.from)}:`;
  }
  if (prompt.to != null) {
    buffer += promptsToString(prompt.to);
  }
  buffer += `:${prompt.when}`;
  return `[${buffer}]`;
}
