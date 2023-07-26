import type {
  EmphasizedNegativePrompt,
  EmphasizedPositivePrompt,
  EmphasizedPrompt,
  EmphasizedWeightedPrompt,
} from "#/prompt/emphasizedPrompt";
import { toString } from "./index";

export function emphasizedPromptToString(prompt: EmphasizedPrompt): string {
  switch (prompt.type) {
    case "emphasized-positive":
      return emphasizedPositivePromptToString(prompt);
    case "emphasized-negative":
      return emphasizedNegativePromptToString(prompt);
    case "emphasized-weighted":
      return emphasizedWeightedPromptToString(prompt);
  }
}

export function emphasizedPositivePromptToString(prompt: EmphasizedPositivePrompt): string {
  return `(${toString(prompt.values)})`;
}

export function emphasizedNegativePromptToString(prompt: EmphasizedNegativePrompt): string {
  return `[${toString(prompt.values)}]`;
}

export function emphasizedWeightedPromptToString(prompt: EmphasizedWeightedPrompt): string {
  return `(${prompt.values.map(toString).join(", ")}:${prompt.weight})`;
}
