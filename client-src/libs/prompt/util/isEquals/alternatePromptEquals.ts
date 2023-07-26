import type { AlternatePrompt } from "#/prompt";
import { isEquals } from "./index";

export function alternatePromptEquals(prompt1: AlternatePrompt, prompt2: AlternatePrompt): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  return prompt1.values.every((prompt, i) => isEquals(prompt, prompt2.values[i]));
}
