import { addClasses } from "@/libs/dom";

export function createTextInput(options?: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  align?: "center";
  size?: "small";
}): {
  root: HTMLElement;
  label?: HTMLElement;
  input: HTMLInputElement;
} {
  const { name, placeholder, align, size } = options || {};
  const root = document.createElement("div");
  root.classList.add("input-field");

  let label: HTMLElement | null = null;
  if (name != null) {
    label = document.createElement("span");
    label.classList.add("label");
    root.appendChild(label);
  }

  const input = document.createElement("input");
  input.classList.add("input");
  addClasses(input, "input", size, align);
  if (placeholder != null) {
    input.placeholder = placeholder;
  }
  root.appendChild(input);

  if (label != null) {
    return { root, label, input };
  } else {
    return { root, input };
  }
}

export function createNumberInput(options?: {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  align?: "center";
  size?: "small";
}): {
  root: HTMLElement;
  label?: HTMLElement;
  input: HTMLInputElement;
} {
  const { root, label, input } = createTextInput(options);
  input.classList.add("number");
  input.type = "number";
  return { root, label, input };
}

export function createSlider(
  name: string,
  options?: {
    min?: number | string;
    max?: number | string;
    defaultValue?: number | string;
    inputStep?: number | string;
    sliderStep?: number | string;
    fractionDigits?: number;
  }
): {
  root: HTMLElement;
  label: HTMLElement;
  slider: HTMLInputElement;
  input: HTMLInputElement;
} {
  const { min, max, defaultValue, inputStep, sliderStep, fractionDigits } = options || {};
  const setup = (element: HTMLInputElement, step?: number | string) => {
    const toString = (value: number | string) =>
      typeof value === "string" ? value : value.toFixed(fractionDigits);
    if (min != null) element.min = toString(min);
    if (max != null) element.max = toString(max);
    if (step != null) element.step = toString(step);
    if (defaultValue != null) element.defaultValue = toString(defaultValue);
  };
  const clampOrDefault = (value: string): number => {
    const toNumber = (value: number | string) =>
      typeof value === "number" ? value : Number(value);
    if (value.length === 0) return defaultValue != null ? toNumber(defaultValue) : 0;
    let valueAsNumber = toNumber(value);
    if (min != null) valueAsNumber = Math.max(valueAsNumber, toNumber(min));
    if (max != null) valueAsNumber = Math.min(valueAsNumber, toNumber(max));
    return valueAsNumber;
  };

  const root = document.createElement("div");
  root.classList.add("slider-field");

  const header = document.createElement("div");
  header.classList.add("header");
  root.appendChild(header);

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = name;
  header.appendChild(label);

  const { root: inputRoot, input } = createNumberInput({ align: "center", size: "small" });
  header.appendChild(inputRoot);
  setup(input, inputStep);

  const slider = document.createElement("input");
  slider.classList.add("slider");
  slider.type = "range";
  root.appendChild(slider);
  setup(slider, sliderStep);

  const notifyUpdate = () => {
    const event = new CustomEvent("slider-update", {
      detail: {
        value: input.value,
        valueAsNumber: input.valueAsNumber,
      },
    });
    root.dispatchEvent(event);
  };

  input.addEventListener("input", () => {
    slider.value = input.value;
    notifyUpdate();
  });
  input.addEventListener("change", () => {
    input.value = clampOrDefault(input.value).toFixed(fractionDigits);
    slider.value = input.value;
    notifyUpdate();
  });
  slider.addEventListener("input", () => {
    input.value = slider.valueAsNumber.toFixed(fractionDigits);
    notifyUpdate();
  });

  return { root, label, slider, input };
}

export function createCheckbox(
  name: string,
  options: {
    defaultValue?: boolean;
  }
): {
  root: HTMLElement;
  checkbox: HTMLInputElement;
  label: HTMLElement;
} {
  const { defaultValue } = options;
  const root = document.createElement("label");
  root.classList.add("checkbox-field");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if (defaultValue != null) {
    checkbox.checked = defaultValue;
  }
  checkbox.classList.add("checkbox");
  root.appendChild(checkbox);

  const label = document.createElement("span");
  label.classList.add("label");
  label.textContent = name;
  root.appendChild(label);

  return { root, checkbox, label };
}
