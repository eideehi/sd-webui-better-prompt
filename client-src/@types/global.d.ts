interface DanbooruTag {
  name: string;
  post_count: number;
  category: number;
  is_deprecated: boolean;
  words: string[];
}

type ExtensionAvailableTab = "txt2img" | "img2img";
type WebUiTab = ExtensionAvailableTab | "other";

type Nullable<T> = T | null | undefined;
type Callback = () => unknown;
