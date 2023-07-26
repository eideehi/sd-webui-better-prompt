import type { PromptCombination } from "#/prompt";
import { toString } from "./index";

export function promptCombinationToString(prompt: PromptCombination): string {
  return prompt.values.map(toString).join(" ");
}
