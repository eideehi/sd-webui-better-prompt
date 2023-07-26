import type { Prompt } from "./prompt";
import type { Prompts } from "./promptAlias";

export interface AlternatePrompt extends Prompt {
  type: "alternate";
  values: Prompts[];
}
