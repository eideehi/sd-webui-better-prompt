import type { EmphasizedPrompt, WeightedEmphasizedPrompt } from "#/prompt";
import { promptsEquals } from "./promptsEquals";

export function emphasizedPromptEquals(
  prompt1: EmphasizedPrompt,
  prompt2: EmphasizedPrompt
): boolean {
  if (prompt1.type !== prompt2.type) return false;
  if (prompt1.subType !== prompt2.subType) return false;
  if (!promptsEquals(prompt1.values, prompt2.values)) return false;
  if (prompt1.subType === "weighted") {
    if (prompt1.weight !== (prompt2 as WeightedEmphasizedPrompt).weight) return false;
  }
  return true;
}
