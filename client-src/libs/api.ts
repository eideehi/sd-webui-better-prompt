import { Prompt } from "./prompt";

export type CheckForUpdatesResult = {
  update: boolean;
  version?: string;
};

export function checkForUpdates(): Promise<CheckForUpdatesResult> {
  const promise = fetch(`/better-prompt-api/v1/check-for-updates?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json());
}

export function getLocalization(): Promise<Record<string, string>> {
  const promise = fetch(`/better-prompt-api/v1/get-localization?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json());
}

export function getDanbooruTags(): Promise<DanbooruTag[]> {
  const promise = fetch(`/better-prompt-api/v1/get-danbooru-tags?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json());
}

export function parsePrompt(prompt: string): Promise<Prompt[]> {
  const promise = fetch(`/better-prompt-api/v1/parse-prompt`, { method: "POST", body: prompt });
  return promise.then((response) => response.json());
}

export function getW14TagsZhEn(prompt: string): Promise<Prompt[]> {
  const promise = fetch(`/better-prompt-api/v1/get-w14-tags-zh-en`, { method: "POST", body: prompt });
  return promise.then((response) => response.json());
}

