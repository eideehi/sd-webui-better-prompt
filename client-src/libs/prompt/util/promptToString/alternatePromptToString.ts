import type { AlternatePrompt } from "#/prompt";
import { promptToString } from "./promptToString";

export function alternatePromptToString(prompt: AlternatePrompt): string {
  return `[${prompt.values.map(promptToString).join("|")}]`;
}
