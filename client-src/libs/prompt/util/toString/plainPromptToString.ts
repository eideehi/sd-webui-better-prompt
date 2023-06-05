import type { PlainPrompt } from "@/libs/prompt";

export function plainPromptToString(prompt: PlainPrompt): string {
  return prompt.value;
}
