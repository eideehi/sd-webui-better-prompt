import type { ExtraNetworksData } from "@/libs/extra-networks";
import type { DanbooruTag } from "@/libs/danbooru";

export type SuggestDataType = "extra-networks" | "danbooru";

interface AnySuggestData {
  type: SuggestDataType;
}

export interface ExtraNetworksSuggestData extends AnySuggestData {
  type: "extra-networks";
  value: ExtraNetworksData;
}

export interface DanbooruSuggestData extends AnySuggestData {
  type: "danbooru";
  value: DanbooruTag;
}

export type SuggestData = ExtraNetworksSuggestData | DanbooruSuggestData;
