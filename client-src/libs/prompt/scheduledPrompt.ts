import type { AllPrompt } from "./allPrompt";
import type { ExtraNetworksPrompt } from "./extraNetworksPrompt";
import type { Prompt } from "./prompt";

export interface ScheduledPrompt extends Prompt {
  type: "scheduled";
  from?: Exclude<AllPrompt, ExtraNetworksPrompt>;
  to?: Exclude<AllPrompt, ExtraNetworksPrompt>;
  when: number;
}
