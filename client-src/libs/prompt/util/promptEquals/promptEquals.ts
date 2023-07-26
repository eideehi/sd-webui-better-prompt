import type {
  AlternatePrompt,
  EmphasizedPrompt,
  ExtraNetworksPrompt,
  PlainPrompt,
  Prompt,
  PromptGroup,
  Prompts,
  ScheduledPrompt,
} from "#/prompt";
import { alternatePromptEquals } from "./alternatePromptEquals";
import { emphasizedPromptEquals } from "./emphasizedPromptEquals";
import { extraNetworksPromptEquals } from "./extraNetworksPromptEquals";
import { plainPromptEquals } from "./plainPromptEquals";
import { promptGroupEquals } from "./promptGroupEquals";
import { promptsEquals } from "./promptsEquals";
import { scheduledPromptEquals } from "./scheduledPromptEquals";

type ArgType = Prompt | PromptGroup | Prompts;

export function promptEquals(prompt1: Prompt, prompt2: Prompt): boolean;
export function promptEquals(group1: PromptGroup, group2: PromptGroup): boolean;
export function promptEquals(prompts1: Prompts, prompts2: Prompts): boolean;
export function promptEquals(arg1: ArgType, arg2: ArgType): boolean {
  if (Array.isArray(arg1)) {
    if (Array.isArray(arg2)) {
      if (arg1.length !== arg2.length) return false;
      return Array.isArray(arg1[0])
        ? promptsEquals(arg1 as Prompts, arg2 as Prompts)
        : promptGroupEquals(arg1 as PromptGroup, arg2 as PromptGroup);
    }
    throw new Error("Illegal arguments");
  }
  if (!Array.isArray(arg2)) return _promptEquals(arg1, arg2);
  throw new Error("Illegal arguments");
}

function _promptEquals(prompt1: Prompt, prompt2: Prompt): boolean {
  if (prompt1 === prompt2) return true;
  if (prompt1.type !== prompt2.type) return false;
  switch (prompt1.type) {
    case "alternate":
      return alternatePromptEquals(prompt1, prompt2 as AlternatePrompt);
    case "emphasized":
      return emphasizedPromptEquals(prompt1, prompt2 as EmphasizedPrompt);
    case "extra-networks":
      return extraNetworksPromptEquals(prompt1, prompt2 as ExtraNetworksPrompt);
    case "plain":
      return plainPromptEquals(prompt1, prompt2 as PlainPrompt);
    case "scheduled":
      return scheduledPromptEquals(prompt1, prompt2 as ScheduledPrompt);
  }
}
