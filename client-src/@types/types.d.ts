declare type DanbooruTag = {
  name: string;
  post_count: number;
  category: number;
  is_deprecated: boolean;
  words: string[];
  zh_cn: string;
};



declare type PromptAvailableTab = "txt2img" | "img2img";

declare type WebUiTab = PromptAvailableTab | "other";

declare type Nullable<T> = T | null | undefined;
