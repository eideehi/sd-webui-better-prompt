import type { MyPrompt } from "@/libs/my-prompt";
import { isArray, isObject, isString } from "@/libs/util/types";

export function getMyPrompts(): Promise<MyPrompt[]> {
  const promise = fetch(`/better-prompt-api/v1/get-my-prompts?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json()).then(parseMyPrompts);
}

function parseMyPrompts(json: unknown): MyPrompt[] {
  return isArray(json) ? json.filter(isMyPrompt) : [];
}

function isMyPrompt(obj: unknown): obj is MyPrompt {
  if (!isObject(obj)) return false;
  if (!isString(obj["label"])) return false;
  if (!isArray(obj["tags"], isString)) return false;
  return isString(obj["prompt"]);
}
