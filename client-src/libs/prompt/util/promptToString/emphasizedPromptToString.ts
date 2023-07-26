import type { EmphasizedPrompt, WeightedEmphasizedPrompt } from "#/prompt";
import { promptsToString } from "./promptsToString";

export function emphasizedPromptToString(prompt: EmphasizedPrompt): string {
  switch (prompt.subType) {
    case "positive":
      return emphasizedPositivePromptToString(prompt);
    case "negative":
      return emphasizedNegativePromptToString(prompt);
    case "weighted":
      return emphasizedWeightedPromptToString(prompt);
  }
}

export function emphasizedPositivePromptToString(prompt: EmphasizedPrompt): string {
  return `(${promptsToString(prompt.values)})`;
}

export function emphasizedNegativePromptToString(prompt: EmphasizedPrompt): string {
  return `[${promptsToString(prompt.values)}]`;
}

export function emphasizedWeightedPromptToString(prompt: WeightedEmphasizedPrompt): string {
  return `(${promptsToString(prompt.values)}:${prompt.weight})`;
}
