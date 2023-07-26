import type { ExtraNetworksData } from "#/extra-networks";
import type { DanbooruTag } from "#/danbooru";
import type { MyPrompt } from "#/my-prompt";

export type SuggestDataType = "extra-networks" | "danbooru" | "my-prompt";

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

export interface MyPromptSuggestData extends AnySuggestData {
  type: "my-prompt";
  value: MyPrompt;
}

export type SuggestData = ExtraNetworksSuggestData | DanbooruSuggestData | MyPromptSuggestData;
