import type { PromptGroup } from "#/prompt";
import { promptEquals } from "./promptEquals";

export function promptGroupEquals(group1: PromptGroup, group2: PromptGroup): boolean {
  if (group1.length !== group2.length) return false;
  return group1.every((prompt, i) => promptEquals(prompt, group2[i]));
}
