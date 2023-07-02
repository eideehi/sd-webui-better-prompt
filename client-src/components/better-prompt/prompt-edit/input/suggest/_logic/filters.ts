import { t } from "@/libs/util/webui";

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
      return t("All");
    case "textual-inversion":
      return t("Textual Inversion");
    case "lora":
      return t("LoRA");
    case "danbooru-general":
      return t("Danbooru Tag (General)");
    case "danbooru-character":
      return t("Danbooru Tag (Character)");
    case "danbooru-copyright":
      return t("Danbooru Tag (Copyright)");
    case "my-prompt":
      return t("My Prompt");
  }
}
