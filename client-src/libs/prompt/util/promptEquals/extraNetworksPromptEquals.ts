import type { ExtraNetworksPrompt } from "#/prompt";

export function extraNetworksPromptEquals(
  prompt1: ExtraNetworksPrompt,
  prompt2: ExtraNetworksPrompt
): boolean {
  if (prompt1.name !== prompt2.name) return false;
  if (prompt1.args.length !== prompt2.args.length) return false;
  return prompt1.args.every((value, i) => value === prompt2.args[i]);
}
