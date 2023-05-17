import type { Prompt } from "@/libs/prompt";

export function parsePrompt(prompt: string): Promise<Prompt[]> {
  const promise = fetch(`/better-prompt-api/v1/parse-prompt`, { method: "POST", body: prompt });
  return promise.then((response) => response.json());
}
