import { getElement } from "@/libs/dom";

export function createTokenCounter(selector: string) {
  const container = document.createElement("div");
  container.classList.add("token-counter");

  const count = document.createElement("span");
  count.classList.add("value");
  container.appendChild(count);

  let data = "";
  const checkForCounterUpdates = () => {
    const element = getElement(selector);
    if (element) {
      const newData = element.textContent || "0/75";
      if (data !== newData) {
        data = newData;
        count.textContent = data;
      }
    }
    window.setTimeout(checkForCounterUpdates, 250);
  };
  checkForCounterUpdates();

  return container;
}
