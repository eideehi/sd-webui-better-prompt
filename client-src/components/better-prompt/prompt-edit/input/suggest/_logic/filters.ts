import {
  suggestFilterAll,
  suggestFilterDanbooruCharacter,
  suggestFilterDanbooruCopyright,
  suggestFilterDanbooruGeneral,
  suggestFilterLora,
  suggestFilterMyPrompt,
  suggestFilterTextualInversion,
} from "@/components/better-prompt/_logic/messages";

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
      return suggestFilterAll.translate();
    case "textual-inversion":
      return suggestFilterTextualInversion.translate();
    case "lora":
      return suggestFilterLora.translate();
    case "danbooru-general":
      return suggestFilterDanbooruGeneral.translate();
    case "danbooru-character":
      return suggestFilterDanbooruCharacter.translate();
    case "danbooru-copyright":
      return suggestFilterDanbooruCopyright.translate();
    case "my-prompt":
      return suggestFilterMyPrompt.translate();
  }
}
