import type { PlainPrompt } from "#/prompt";

export function plainPromptToString(prompt: PlainPrompt): string {
  return prompt.value;
}
