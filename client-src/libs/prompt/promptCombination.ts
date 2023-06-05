import type { Prompt } from "@/libs/prompt/prompt";
import type { BasicPrompt } from "@/libs/prompt/basicPrompt";

export interface PromptCombination extends Prompt {
  type: "combination";
  values: BasicPrompt[];
}
