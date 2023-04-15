import { _ } from "@/libs/webui";
import { createTextInput } from "../../common/forms";
import { createFilterComponents } from "./filter";
import { createSuggestComponent } from "./suggest";

export function createInputComponent(tabName: PromptAvailableTab): HTMLElement {
  const container = document.createElement("div");
  container.classList.add("prompt-input");

  const { root, input } = createTextInput({
    placeholder: _("Input prompt..."),
  });
  container.appendChild(root);

  const filter = createFilterComponents();
  container.appendChild(filter);

  const suggest = createSuggestComponent(tabName, input, filter);
  container.appendChild(suggest);

  return container;
}
