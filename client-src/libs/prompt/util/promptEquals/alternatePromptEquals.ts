import type { AlternatePrompt } from "#/prompt";
import { promptsEquals } from "./promptsEquals";

export function alternatePromptEquals(prompt1: AlternatePrompt, prompt2: AlternatePrompt): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  return prompt1.values.every((collection, i) => promptsEquals(collection, prompt2.values[i]));
}
