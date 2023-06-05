import { type Readable, writable } from "svelte/store";
import type { DanbooruTag } from "@/libs/danbooru";

const _danbooruTags = writable<DanbooruTag[]>([]);
export const danbooruTags: Readable<DanbooruTag[]> = { subscribe: _danbooruTags.subscribe };

let init = false;

export function initDanbooruTags(tags: DanbooruTag[]): void {
  if (init) return;
  init = true;
  _danbooruTags.set(tags);
}
