import { type DanbooruTag, isDanbooruTag } from "@/libs/danbooru";

export function getDanbooruTags(): Promise<DanbooruTag[]> {
  const promise = fetch(`/better-prompt-api/v1/get-danbooru-tags?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json()).then(parseDanbooruTags);
}

function parseDanbooruTags(json: unknown): DanbooruTag[] {
  return !Array.isArray(json) ? [] : json.filter(isDanbooruTag);
}
