import type { MyPrompt } from "../my-prompt";
import { isBoolean, isObject } from "../util/types";

export function updateMyPrompts(myPrompts: MyPrompt[]): Promise<boolean> {
  const promise = fetch(`/better-prompt-api/v1/update-my-prompts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(myPrompts),
  });
  return promise.then((response) => response.json()).then(parseResponse);
}

function parseResponse(json: unknown): boolean {
  if (!isObject(json)) return false;
  return isBoolean(json["success"]) && json["success"];
}
