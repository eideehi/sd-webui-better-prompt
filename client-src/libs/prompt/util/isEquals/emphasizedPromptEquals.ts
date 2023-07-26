import type {
  EmphasizedPrompt,
  EmphasizedNegativePrompt,
  EmphasizedPositivePrompt,
  EmphasizedWeightedPrompt,
} from "#/prompt";
import { isEquals } from "./index";

export function emphasizedPromptEquals(
  prompt1: EmphasizedPrompt,
  prompt2: EmphasizedPrompt
): boolean {
  if (prompt1.type !== prompt2.type) return false;
  switch (prompt1.type) {
    case "emphasized-positive":
      return emphasizedPositivePromptEquals(prompt1, prompt2 as EmphasizedPositivePrompt);
    case "emphasized-negative":
      return emphasizedNegativePromptEquals(prompt1, prompt2 as EmphasizedNegativePrompt);
    case "emphasized-weighted":
      return emphasizedWeightedPromptEquals(prompt1, prompt2 as EmphasizedWeightedPrompt);
  }
  return false;
}

export function emphasizedPositivePromptEquals(
  prompt1: EmphasizedPositivePrompt,
  prompt2: EmphasizedPositivePrompt
): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  return prompt1.values.every((prompt, i) => isEquals(prompt, prompt2.values[i]));
}

export function emphasizedNegativePromptEquals(
  prompt1: EmphasizedNegativePrompt,
  prompt2: EmphasizedNegativePrompt
): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  return prompt1.values.every((prompt, i) => isEquals(prompt, prompt2.values[i]));
}

export function emphasizedWeightedPromptEquals(
  prompt1: EmphasizedWeightedPrompt,
  prompt2: EmphasizedWeightedPrompt
): boolean {
  if (prompt1.values.length !== prompt2.values.length) return false;
  if (prompt1.weight !== prompt2.weight) return false;
  return prompt1.values.every((prompt, i) => isEquals(prompt, prompt2.values[i]));
}
