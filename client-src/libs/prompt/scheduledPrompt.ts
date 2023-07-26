import type { Prompt } from "./prompt";
import type { Prompts } from "./promptAlias";

export interface ScheduledPrompt extends Prompt {
  type: "scheduled";
  from?: Prompts;
  to?: Prompts;
  when: number;
}
