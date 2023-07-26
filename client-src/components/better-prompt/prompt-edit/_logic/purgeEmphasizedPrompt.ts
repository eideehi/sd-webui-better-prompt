import type { EmphasizedNegativePrompt, EmphasizedPositivePrompt, InnerPrompt } from "#/prompt";

export function purgeEmphasizedPrompt(
  prompt: EmphasizedPositivePrompt | EmphasizedNegativePrompt
): InnerPrompt[] {
  if (prompt.values.length === 1) {
    switch (prompt.values[0].type) {
      case "emphasized-positive":
      case "emphasized-negative":
        return purgeEmphasizedPrompt(prompt.values[0]);
    }
  }
  return prompt.values;
}
