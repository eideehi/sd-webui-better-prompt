import type { Prompt } from "./prompt";
import type { InnerPrompt } from "./innerPrompt";

export interface ScheduledPrompt extends Prompt {
  type: "scheduled";
  from?: InnerPrompt;
  to?: InnerPrompt;
  when: number;
}
