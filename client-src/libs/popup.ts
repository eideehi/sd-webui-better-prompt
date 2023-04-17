import { applyClasses, hasElement, getPosition, hasChild, getElementAll, getElement } from "./dom";

export function getPopupById(id: string): Nullable<HTMLElement> {
  return getElement(`.better-prompt.popup[data-popup-id="${id}"]`);
}

export function getPopupByGroup(group: string): HTMLElement[] {
  return getElementAll(`.better-prompt.popup[data-group="${group}"]`);
}

export function showPopupBelow(
  parent: Element,
  options: {
    id: string;
    groupToClose?: string;
    contentFactory: () => Nullable<HTMLElement> | Promise<Nullable<HTMLElement>>;
  }
): void {
  const { id, contentFactory, groupToClose } = options;
  if (getPopupById(id) != null) return;

  const contentOrPromise = contentFactory();
  if (contentOrPromise == null) return;

  const showPopup = (popup: HTMLElement) => {
    popup.classList.add("better-prompt", "popup");
    applyClasses(popup, hasElement(".gradio-container.dark"), "dark");
    popup.dataset.popupId = id;
    if (groupToClose != null) {
      closePopupByGroup(groupToClose);
      popup.dataset.group = groupToClose;
    }

    const update = () => {
      const { left: parentLeft, bottom: parentBottom } = getPosition(parent);
      const bodyWidth = document.body.clientWidth;
      const popupWidth = popup.clientWidth;
      const left = parentLeft + popupWidth > bodyWidth ? bodyWidth - popupWidth - 4 : parentLeft;
      const top = parentBottom + 4;
      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    };

    window.addEventListener("resize", update);

    const onMouseDown = (event: Event) => {
      const { target } = event;
      if (!(event instanceof MouseEvent) || !(target instanceof Element)) return;
      if (hasElement(".global-popup[style='display: flex;']")) return;
      if (event.button !== 1 && target !== popup && target !== parent && !hasChild(popup, target)) {
        closePopup(popup);
      }
    };
    gradioApp().addEventListener("mousedown", onMouseDown);

    popup.addEventListener("close-popup", () => {
      gradioApp().removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("resize", update);
      popup.remove();
    });

    gradioApp().appendChild(popup);
    update();
  };

  if (contentOrPromise instanceof HTMLElement) {
    showPopup(contentOrPromise);
  } else {
    contentOrPromise.then((content) => {
      if (content != null) {
        showPopup(content);
      }
    });
  }
}

export function closePopup(element: Element): void {
  element.dispatchEvent(new CustomEvent("close-popup"));
}

export function closePopupById(id: string): boolean {
  const popup = getPopupById(id);
  if (popup == null) return false;
  closePopup(popup);
  return true;
}

export function closePopupByGroup(group: string): boolean {
  const popups = getPopupByGroup(group);
  if (popups.length === 0) return false;
  popups.forEach(closePopup);
  return true;
}
