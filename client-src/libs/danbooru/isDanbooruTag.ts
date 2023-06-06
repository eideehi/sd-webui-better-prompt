import type { DanbooruTag } from "./danbooruTag";

export function isDanbooruTag(obj: unknown): obj is DanbooruTag {
  if (obj == null || typeof obj !== "object") return false;
  if (typeof obj["name"] !== "string") return false;
  if (typeof obj["post_count"] !== "number") return false;
  return typeof obj["category"] === "number" && [0, 3, 4].includes(obj["category"]);
}
