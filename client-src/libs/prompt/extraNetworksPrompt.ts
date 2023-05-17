import type { Prompt } from "./prompt";

export interface ExtraNetworksPrompt extends Prompt {
  type: "extranetworks";
  args: string[];
}
