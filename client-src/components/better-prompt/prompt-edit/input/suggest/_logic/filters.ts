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
      return t("suggest-filter-all", { defaultValue: "All" });
    case "textual-inversion":
      return t("suggest-filter-textual-inversion", {
        defaultValue: "Textual Inversion",
      });
    case "lora":
      return t("suggest-filter-lora", { defaultValue: "LoRA" });
    case "danbooru-general":
      return t("suggest-filter-danbooru-general", {
        defaultValue: "Danbooru Tag (General)",
      });
    case "danbooru-character":
      return t("suggest-filter-danbooru-character", {
        defaultValue: "Danbooru Tag (Character)",
      });
    case "danbooru-copyright":
      return t("suggest-filter-danbooru-copyright", {
        defaultValue: "Danbooru Tag (Copyright)",
      });
    case "my-prompt":
      return t("suggest-filter-my-prompt", { defaultValue: "My Prompt" });
  }
}
