import type { Prompts } from "#/prompt";
import { promptGroupEquals } from "./promptGroupEquals";

export function promptsEquals(collection1: Prompts, collection2: Prompts): boolean {
  if (collection1.length !== collection2.length) return false;
  return collection1.every((group, i) => promptGroupEquals(group, collection2[i]));
}
