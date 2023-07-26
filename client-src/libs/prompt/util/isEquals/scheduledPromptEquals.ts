import type { InnerPrompt, ScheduledPrompt } from "#/prompt";
import { isEquals } from "./index";

export function scheduledPromptEquals(prompt1: ScheduledPrompt, prompt2: ScheduledPrompt): boolean {
  if (prompt1.when !== prompt2.when) return false;
  if ((prompt1.to == null) !== (prompt2.to == null)) return false;
  if (prompt1.to != null && !isEquals(prompt1.to, prompt2.to as InnerPrompt)) return false;
  if ((prompt1.from == null) !== (prompt2.from == null)) return false;
  return prompt1.from == null || isEquals(prompt1.from, prompt2.from as InnerPrompt);
}
