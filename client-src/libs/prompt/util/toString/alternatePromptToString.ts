import type { AlternatePrompt } from "#/prompt";
import { toString } from "./index";

export function alternatePromptToString(prompt: AlternatePrompt): string {
  return `[${prompt.values.map(toString).join("|")}]`;
}
