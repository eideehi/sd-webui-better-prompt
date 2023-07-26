import type { PromptType } from "#/prompt";

const promptTypes: Set<string> = new Set<PromptType>([
  "alternate",
  "emphasized",
  "extra-networks",
  "plain",
  "scheduled",
]);

export function isPromptType(type: string): type is PromptType {
  return promptTypes.has(type);
}
