import type { Prompt, PromptGroup, Prompts } from "#/prompt";
import { alternatePromptToString } from "./alternatePromptToString";
import { emphasizedPromptToString } from "./emphasizedPromptToString";
import { extraNetworksPromptToString } from "./extraNetworksPromptToString";
import { plainPromptToString } from "./plainPromptToString";
import { promptGroupToString } from "./promptGroupToString";
import { promptsToString } from "./promptsToString";
import { scheduledPromptToString } from "./scheduledPromptToString";

type ArgType = Prompt | PromptGroup | Prompts;

export function promptToString(prompt: Prompt): string;
export function promptToString(group: PromptGroup): string;
export function promptToString(prompts: Prompts): string;
export function promptToString(arg1: ArgType): string {
  if (Array.isArray(arg1)) {
    if (arg1.length === 0) return "";
    if (Array.isArray(arg1[0])) return promptsToString(arg1 as Prompts);
    return promptGroupToString(arg1 as PromptGroup);
  }
  return _promptToString(arg1);
}

function _promptToString(prompt: Prompt): string {
  switch (prompt.type) {
    case "alternate":
      return alternatePromptToString(prompt);
    case "emphasized":
      return emphasizedPromptToString(prompt);
    case "extra-networks":
      return extraNetworksPromptToString(prompt);
    case "plain":
      return plainPromptToString(prompt);
    case "scheduled":
      return scheduledPromptToString(prompt);
  }
}
