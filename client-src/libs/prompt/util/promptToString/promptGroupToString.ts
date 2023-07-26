import type { PromptGroup } from "#/prompt";
import { promptToString } from "./promptToString";

export function promptGroupToString(group: PromptGroup): string {
  return group.map(promptToString).join(" ");
}
