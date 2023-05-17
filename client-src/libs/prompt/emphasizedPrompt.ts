import type { AllPrompt } from "./allPrompt";
import type { ExtraNetworksPrompt } from "./extraNetworksPrompt";
import type { Prompt } from "./prompt";

export interface EmphasizedPrompt extends Prompt {
  type: "emphasized";
  negative: boolean;
  values: Array<Exclude<AllPrompt, ExtraNetworksPrompt>>;
  multiplier?: number;
}
