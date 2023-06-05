import type { Prompt } from "./prompt";
import type { InnerPrompt } from "./innerPrompt";

export type EmphasizedPrompt =
  | EmphasizedPositivePrompt
  | EmphasizedNegativePrompt
  | EmphasizedWeightedPrompt;

export interface EmphasizedPositivePrompt extends Prompt {
  type: "emphasized-positive";
  values: InnerPrompt[];
}

export interface EmphasizedNegativePrompt extends Prompt {
  type: "emphasized-negative";
  values: InnerPrompt[];
}

export interface EmphasizedWeightedPrompt extends Prompt {
  type: "emphasized-weighted";
  values: InnerPrompt[];
  weight: number;
}
