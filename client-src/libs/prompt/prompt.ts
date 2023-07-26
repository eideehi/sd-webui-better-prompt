export type PromptType = "alternate" | "emphasized" | "extra-networks" | "scheduled" | "plain";

export interface Prompt {
  type: PromptType;
}
