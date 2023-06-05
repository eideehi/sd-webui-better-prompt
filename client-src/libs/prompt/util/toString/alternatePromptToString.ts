import type { AlternatePrompt } from "@/libs/prompt";
import { toString } from "./index";

export function alternatePromptToString(prompt: AlternatePrompt): string {
  return `[${prompt.values.map(toString).join("|")}]`;
}
