import type { ScheduledPrompt, Prompts } from "#/prompt";
import { promptsEquals } from "./promptsEquals";

export function scheduledPromptEquals(prompt1: ScheduledPrompt, prompt2: ScheduledPrompt): boolean {
  if (prompt1.when !== prompt2.when) return false;

  const { from: from1, to: to1 } = prompt1;
  const { from: from2, to: to2 } = prompt2;
  if ((from1 == null) !== (from2 == null)) return false;
  if ((to1 == null) !== (to2 == null)) return false;

  if (from1 != null && !promptsEquals(from1, from2 as Prompts)) return false;
  return to1 == null || promptsEquals(to1, to2 as Prompts);
}
