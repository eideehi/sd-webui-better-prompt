import { type Prompt } from "@/libs/prompt";

export function isPopupEnabled(prompt: Prompt): boolean {
  switch (prompt.type) {
    case "plain":
    case "emphasized-positive":
    case "emphasized-negative":
    case "emphasized-weighted":
      return true;
    case "extra-networks":
      return prompt.name === "lora";
  }
  return false;
}
