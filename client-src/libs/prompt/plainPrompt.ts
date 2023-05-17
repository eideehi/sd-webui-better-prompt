import type { Prompt } from "./prompt";

export interface PlainPrompt extends Prompt {
  type: "plain";
  value: string;
}
