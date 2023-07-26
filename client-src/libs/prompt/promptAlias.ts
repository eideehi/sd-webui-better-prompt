import type { AlternatePrompt } from "./alternatePrompt";
import type {
  NegativeEmphasizedPrompt,
  PositiveEmphasizedPrompt,
  WeightedEmphasizedPrompt,
} from "./emphasizedPrompt";
import type { ExtraNetworksPrompt } from "./extraNetworksPrompt";
import type { PlainPrompt } from "./plainPrompt";
import type { ScheduledPrompt } from "./scheduledPrompt";

export type EmphasizedPrompt =
  | PositiveEmphasizedPrompt
  | NegativeEmphasizedPrompt
  | WeightedEmphasizedPrompt;

export type Prompt =
  | AlternatePrompt
  | EmphasizedPrompt
  | ExtraNetworksPrompt
  | PlainPrompt
  | ScheduledPrompt;

export type PromptGroup = Prompt[];

export type Prompts = PromptGroup[];
