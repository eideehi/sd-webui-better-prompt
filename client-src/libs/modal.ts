import { applyClasses, hasElement, removeAllChild } from "./dom";

let root: HTMLElement | null = null;
let contentWrapper: HTMLElement;

/**
 * Show or hide HTML elements.
 * @param element - The target element to toggle the hidden.
 * @param force -
 *   If true, it will be hidden. If false, it will be displayed. If no option
 *   is specified, it will toggle between being displayed and hidden.
 */
function hidden(element: HTMLElement | null, force?: boolean) {
  element?.classList.toggle("!hidden", force);
}

/**
 * Returns the modal element used for displaying Better Styles, creating it if it doesn't exist yet.
 */
function createOrInitModal(): void {
  if (root) {
    // Switch the modal theme to match the app.
    applyClasses(root, hasElement(".gradio-container.dark"), "dark");

    removeAllChild(contentWrapper);
    return;
  }

  root = document.createElement("div");
  root.id = "better-prompt-modal";
  hidden(root, true);
  root.classList.add("better-prompt", "modal");
  root.addEventListener("mousedown", (event) => {
    if (event.target === root && event.button === 0) {
      event.preventDefault();
      hidden(root, true);
    }
  });
  gradioApp().appendChild(root);

  contentWrapper = document.createElement("div");
  contentWrapper.classList.add("content-wrapper");
  root.appendChild(contentWrapper);

  // Switch the modal theme to match the app.
  applyClasses(root, hasElement(".gradio-container.dark"), "dark");
}

/**
 * Shows a modal with the specified content.
 * @param content - The content to show in the modal.
 */
export function showModal(content: HTMLElement) {
  createOrInitModal();
  contentWrapper.appendChild(content);
  hidden(root, false);
}

/**
 * Closes the modal containing the specified content, if it exists.
 * @param content - The content to close in the modal.
 */
export function closeModal(content: HTMLElement) {
  if (contentWrapper?.removeChild(content)) {
    hidden(root, !contentWrapper.hasChildNodes());
  }
}
