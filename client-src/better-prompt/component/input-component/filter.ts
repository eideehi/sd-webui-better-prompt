import { getElement, getElementAll } from "@/libs/dom";
import { toggleValue } from "@/libs/string";
import { _ } from "@/libs/webui";
import { createCheckbox } from "../../common/forms";

export type FilterType =
  | "all"
  | "textual-inversion"
  | "lora"
  | "danbooru-general"
  | "danbooru-character"
  | "danbooru-copyright";

const filterTypes: FilterType[] = [
  "all",
  "textual-inversion",
  "lora",
  "danbooru-general",
  "danbooru-character",
  "danbooru-copyright",
];

const typeToLabel = (type: FilterType) => {
  switch (type) {
    case "all":
      return _("All");
    case "textual-inversion":
      return _("Textual Inversion");
    case "lora":
      return _("LoRA");
    case "danbooru-general":
      return _("Danbooru Tag (General)");
    case "danbooru-character":
      return _("Danbooru Tag (Character)");
    case "danbooru-copyright":
      return _("Danbooru Tag (Copyright)");
  }
};

function isFilterType(type: string): type is FilterType {
  return (
    type === "all" ||
    type === "textual-inversion" ||
    type === "lora" ||
    type === "danbooru-general" ||
    type === "danbooru-character" ||
    type === "danbooru-copyright"
  );
}

export function getFilterTypes(filter: HTMLElement): FilterType[] {
  const value = filter.dataset.filter || "";
  return value.split("|").filter(isFilterType);
}

export function createFilterComponents(): HTMLElement {
  const filter = document.createElement("div");
  filter.classList.add("suggest-filter");

  let filterValue = "all";
  filter.dataset.filter = filterValue;
  filterTypes.forEach((type) => {
    const isAllType = type === "all";

    const { root: checkboxRoot, checkbox } = createCheckbox(typeToLabel(type), {
      defaultValue: isAllType,
    });
    checkbox.dataset.filterType = type;
    filter.appendChild(checkboxRoot);

    const uncheck = (element: HTMLElement | null) => {
      if (element instanceof HTMLInputElement && element.checked) {
        element.click();
      }
    };
    checkbox.addEventListener("input", () => {
      const checked = checkbox.checked;
      filterValue = toggleValue(filterValue, type, checked);
      if (!isAllType && checked) {
        uncheck(getElement(filter, 'input[data-filter-type="all"]'));
      } else if (isAllType && checked) {
        getElementAll(filter, 'input:not([data-filter-type="all"])').forEach(uncheck);
      }
      filter.dataset.filter = filterValue;
      filter.dispatchEvent(new CustomEvent("update-filter"));
    });
  });

  return filter;
}
