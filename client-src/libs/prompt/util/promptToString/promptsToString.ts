import type { Prompts } from "#/prompt";
import { promptGroupToString } from "./promptGroupToString";

export function promptsToString(collection: Prompts): string {
  return collection.map(promptGroupToString).join(", ");
}
