import type { PromptCombination } from "#/prompt";
import { isEquals } from "./index";

export function promptCombinationEquals(
  prompt1: PromptCombination,
  prompt2: PromptCombination
): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  return prompt1.values.every((prompt, i) => isEquals(prompt, prompt2.values[i]));
}
