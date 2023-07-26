import type { PromptType } from "#/prompt";

const promptTypes: Set<string> = new Set<PromptType>([
  "alternate",
  "combination",
  "emphasized-positive",
  "emphasized-negative",
  "emphasized-weighted",
  "plain",
  "scheduled",
  "extra-networks",
]);

export function isPromptType(type: string): type is PromptType {
  return promptTypes.has(type);
}
