import type { ExtraNetworksPrompt } from "#/prompt";

export function extraNetworksPromptEquals(
  prompt1: ExtraNetworksPrompt,
  prompt2: ExtraNetworksPrompt
): boolean {
  if (prompt1.name !== prompt2.name) return false;
  if (prompt1.name === "textual-inversion") return textualInversionPromptEquals(prompt1, prompt2);
  if (prompt1.name === "lora") return loraPromptEquals(prompt1, prompt2);
  return prompt1.args.every((value, i) => value === prompt2.args[i]);
}

function textualInversionPromptEquals(
  prompt1: ExtraNetworksPrompt,
  prompt2: ExtraNetworksPrompt
): boolean {
  return prompt1.args[0] === prompt2.args[0];
}

function loraPromptEquals(prompt1: ExtraNetworksPrompt, prompt2: ExtraNetworksPrompt): boolean {
  if (prompt1.args[0] !== prompt2.args[0]) return false;
  return Number(prompt1.args[1]) === Number(prompt2.args[1]);
}
