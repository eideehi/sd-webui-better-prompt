import type { ExtraNetworksPrompt } from "#/prompt";

export function extraNetworksPromptToString(prompt: ExtraNetworksPrompt): string {
  const { name, args } = prompt;
  if (name === "textual-inversion") {
    return args[0];
  }

  let buffer = name;
  for (let i = 0; i < args.length; i++) {
    buffer += `:${args[i]}`;
  }
  return `<${buffer}>`;
}
