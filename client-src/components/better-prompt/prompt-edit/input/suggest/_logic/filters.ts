import * as t from "~/messages";

export type FilterType =
  | "all"
  | "textual-inversion"
  | "lora"
  | "danbooru-general"
  | "danbooru-character"
  | "danbooru-copyright"
  | "my-prompt";

export const FilterTypes: readonly FilterType[] = [
  "all",
  "textual-inversion",
  "lora",
  "danbooru-general",
  "danbooru-character",
  "danbooru-copyright",
  "my-prompt",
] as const;

export function typeToLabel(type: FilterType): string {
  switch (type) {
    case "all":
      return t.SuggestFilterAll();
    case "textual-inversion":
      return t.SuggestFilterTextualInversion();
    case "lora":
      return t.SuggestFilterLora();
    case "danbooru-general":
      return t.SuggestFilterDanbooruGeneral();
    case "danbooru-character":
      return t.SuggestFilterDanbooruCharacter();
    case "danbooru-copyright":
      return t.SuggestFilterDanbooruCopyright();
    case "my-prompt":
      return t.SuggestFilterMyPrompt();
  }
}
