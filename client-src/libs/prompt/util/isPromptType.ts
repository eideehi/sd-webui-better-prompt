import type { PromptType } from "@/libs/prompt";

const promptTypes: Set<string> = new Set<PromptType>([
  "plain",
  "emphasized",
  "scheduled",
  "extranetworks",
  "whitespace",
]);

export function isPromptType(type: string): type is PromptType {
  return promptTypes.has(type);
}
