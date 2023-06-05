export type PromptType =
  | "alternate"
  | "combination"
  | "emphasized-positive"
  | "emphasized-negative"
  | "emphasized-weighted"
  | "extra-networks"
  | "scheduled"
  | "plain";

export interface Prompt {
  type: PromptType;
}
