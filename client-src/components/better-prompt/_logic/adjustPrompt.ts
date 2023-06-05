import type { Prompt } from "@/libs/prompt";
import type { ExtraNetworksData } from "@/libs/extra-networks";

export function adjustPrompt(prompt: Prompt, textualInversions: ExtraNetworksData[]): Prompt {
  if (prompt.type !== "plain") return prompt;
  const data = textualInversions.find((data) => data.name === prompt.value);
  if (data == null) return prompt;
  return {
    type: "extra-networks",
    name: data.type,
    args: [data.name],
  };
}
