import type { Prompt } from "./prompt";
import type { InnerPrompt } from "./innerPrompt";

export interface AlternatePrompt extends Prompt {
  type: "alternate";
  values: InnerPrompt[];
}
