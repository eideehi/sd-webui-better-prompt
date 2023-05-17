export type PromptType = "plain" | "emphasized" | "scheduled" | "extranetworks" | "whitespace";

export interface Prompt {
  type: PromptType;
}
