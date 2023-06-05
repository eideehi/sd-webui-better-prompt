import type { Prompt } from "./prompt";

export interface ExtraNetworksPrompt extends Prompt {
  type: "extra-networks";
  name: string;
  args: string[];
}
