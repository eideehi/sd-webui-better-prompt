import type {
  AlternatePrompt,
  EmphasizedNegativePrompt,
  EmphasizedPositivePrompt,
  EmphasizedWeightedPrompt,
  ExtraNetworksPrompt,
  PlainPrompt,
  Prompt,
  PromptCombination,
  ScheduledPrompt,
} from "#/prompt";
import { alternatePromptEquals } from "./alternatePromptEquals";
import { promptCombinationEquals } from "./promptCombinationEquals";
import {
  emphasizedNegativePromptEquals,
  emphasizedPositivePromptEquals,
  emphasizedWeightedPromptEquals,
} from "./emphasizedPromptEquals";
import { extraNetworksPromptEquals } from "./extraNetworksPromptEquals";
import { plainPromptEquals } from "./plainPromptEquals";
import { scheduledPromptEquals } from "./scheduledPromptEquals";

export function isEquals(prompt1: Prompt, prompt2: Prompt): boolean;
export function isEquals(prompts1: Prompt[], prompts2: Prompt[]): boolean;
export function isEquals(arg1: OneOrMany<Prompt>, arg2: OneOrMany<Prompt>): boolean {
  if (Array.isArray(arg1)) {
    if (Array.isArray(arg2)) return isEquals2(arg1, arg2);
    throw new Error("Illegal arguments");
  }
  if (!Array.isArray(arg2)) return isEquals1(arg1, arg2);
  throw new Error("Illegal arguments");
}

function isEquals1(prompt1: Prompt, prompt2: Prompt): boolean {
  if (prompt1 === prompt2) return true;
  if (prompt1.type !== prompt2.type) return false;
  switch (prompt1.type) {
    case "alternate":
      return alternatePromptEquals(prompt1, prompt2 as AlternatePrompt);
    case "combination":
      return promptCombinationEquals(prompt1, prompt2 as PromptCombination);
    case "emphasized-positive":
      return emphasizedPositivePromptEquals(prompt1, prompt2 as EmphasizedPositivePrompt);
    case "emphasized-negative":
      return emphasizedNegativePromptEquals(prompt1, prompt2 as EmphasizedNegativePrompt);
    case "emphasized-weighted":
      return emphasizedWeightedPromptEquals(prompt1, prompt2 as EmphasizedWeightedPrompt);
    case "extra-networks":
      return extraNetworksPromptEquals(prompt1, prompt2 as ExtraNetworksPrompt);
    case "plain":
      return plainPromptEquals(prompt1, prompt2 as PlainPrompt);
    case "scheduled":
      return scheduledPromptEquals(prompt1, prompt2 as ScheduledPrompt);
  }
  return false;
}

function isEquals2(prompts1: Prompt[], prompts2: Prompt[]): boolean {
  if (prompts1.length !== prompts2.length) return false;
  return prompts1.every((value, i) => isEquals1(value, prompts2[i]));
}
