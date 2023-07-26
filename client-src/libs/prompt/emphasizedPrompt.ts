import type { Prompt } from "./prompt";
import type { Prompts } from "./promptAlias";

export interface EmphasizedPrompt extends Prompt {
  type: "emphasized";
  subType: "positive" | "negative" | "weighted";
  values: Prompts;
}

export interface PositiveEmphasizedPrompt extends EmphasizedPrompt {
  subType: "positive";
}

export interface NegativeEmphasizedPrompt extends EmphasizedPrompt {
  subType: "negative";
}

export interface WeightedEmphasizedPrompt extends EmphasizedPrompt {
  subType: "weighted";
  weight: number;
}
