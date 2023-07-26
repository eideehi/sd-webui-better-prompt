import type { Prompt } from "#/prompt/prompt";
import type { BasicPrompt } from "#/prompt/basicPrompt";

export interface PromptCombination extends Prompt {
  type: "combination";
  values: BasicPrompt[];
}
