export type PromptType = "plain" | "emphasized" | "scheduled" | "extranetworks" | "whitespace";

export type Prompt =
  | PlainPrompt
  | EmphasizedPrompt
  | ScheduledPrompt
  | ExtraNetworksPrompt
  | WhiteSpacePrompt;

export interface TypedPrompt {
  type: PromptType;
}

export interface PlainPrompt extends TypedPrompt {
  type: "plain";
  value: string;
}

export interface EmphasizedPrompt extends TypedPrompt {
  type: "emphasized";
  negative: boolean;
  values: Array<Exclude<Prompt, ExtraNetworksPrompt>>;
  multiplier?: number;
}

export interface ScheduledPrompt extends TypedPrompt {
  type: "scheduled";
  from?: Exclude<Prompt, ExtraNetworksPrompt>;
  to?: Exclude<Prompt, ExtraNetworksPrompt>;
  when: number;
}

export interface ExtraNetworksPrompt extends TypedPrompt {
  type: "extranetworks";
  args: string[];
}

export interface WhiteSpacePrompt extends TypedPrompt {
  type: "whitespace";
}

const ALL_PROMPT_TYPE = new Set([
  "plain",
  "emphasized",
  "scheduled",
  "extranetworks",
  "whitespace",
]);

export function isPromptType(type: string): type is PromptType {
  return ALL_PROMPT_TYPE.has(type);
}

/**
 * A regular expression to match a trailing comma followed by optional whitespace.
 */
const TRAILING_COMMA_REGEX = /,(\s+)?$/g;

/**
 * A regular expression to match a leading comma preceded by optional whitespace.
 */
const LEADING_COMMA_REGEX = /^(\s+)?,/g;

export function concatPrompt(prompt1: string, prompt2: string): string {
  if (!prompt1 || TRAILING_COMMA_REGEX.test(prompt1) || LEADING_COMMA_REGEX.test(prompt2)) {
    return prompt1 + prompt2;
  }
  return `${prompt1}, ${prompt2}`;
}
