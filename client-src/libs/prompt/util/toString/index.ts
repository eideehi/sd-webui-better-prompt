import type { Prompt } from "@/libs/prompt";
import { concatPrompt } from "@/libs/prompt";
import { alternatePromptToString } from "./alternatePromptToString";
import {
  emphasizedNegativePromptToString,
  emphasizedPositivePromptToString,
  emphasizedWeightedPromptToString,
} from "./emphasizedPromptToString";
import { extraNetworksPromptToString } from "./extraNetworksPromptToString";
import { plainPromptToString } from "./plainPromptToString";
import { promptCombinationToString } from "./promptCombinationToString";
import { scheduledPromptToString } from "./scheduledPromptToString";

export {
  alternatePromptToString,
  emphasizedNegativePromptToString,
  emphasizedPositivePromptToString,
  emphasizedWeightedPromptToString,
  extraNetworksPromptToString,
  plainPromptToString,
  promptCombinationToString,
  scheduledPromptToString,
};

export function toString(prompt: Prompt): string;
export function toString(prompts: Prompt[]): string;
export function toString(arg1: Prompt | Prompt[]): string {
  return Array.isArray(arg1) ? toString2(arg1) : toString1(arg1);
}

function toString1(prompt: Prompt): string {
  switch (prompt.type) {
    case "alternate":
      return alternatePromptToString(prompt);
    case "combination":
      return promptCombinationToString(prompt);
    case "emphasized-positive":
      return emphasizedPositivePromptToString(prompt);
    case "emphasized-negative":
      return emphasizedNegativePromptToString(prompt);
    case "emphasized-weighted":
      return emphasizedWeightedPromptToString(prompt);
    case "extra-networks":
      return extraNetworksPromptToString(prompt);
    case "plain":
      return plainPromptToString(prompt);
    case "scheduled":
      return scheduledPromptToString(prompt);
  }
  return "";
}

function toString2(prompts: Prompt[]): string {
  if (prompts.length < 1) return "";

  let skipComma = false;
  let i = 0;
  let buffer = "";
  do {
    const prompt = prompts[i];
    if (skipComma) {
      buffer = `${buffer} ${toString1(prompt)}`;
    } else {
      buffer = concatPrompt(buffer, toString1(prompt));
    }
    skipComma = prompt.type === "extra-networks" && prompt.name !== "textual-inversion";
    i++;
  } while (i < prompts.length);

  return buffer;
}
