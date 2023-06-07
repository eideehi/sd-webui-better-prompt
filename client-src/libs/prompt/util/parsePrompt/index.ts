import type {
  AlternatePrompt,
  BasicPrompt,
  EmphasizedPrompt,
  ExtraNetworksPrompt,
  InnerPrompt,
  PlainPrompt,
  Prompt,
  PromptCombination,
  ScheduledPrompt,
} from "@/libs/prompt";
import { getOption } from "@/libs/util/webui";
import { get_parser } from "./prompt-parser";

export function parsePrompt(text: string, callback: Callback1<Prompt[]>): void;
export function parsePrompt(text: string): Nullable<Prompt[]>;
export function parsePrompt(
  text: string,
  callback?: Callback1<Prompt[]>
): void | Nullable<Prompt[]> {
  const prompts = parse(text);
  if (prompts != null && callback != null) {
    callback(prompts);
    return void 0;
  }
  return prompts;
}

function parse(text: string): Nullable<Prompt[]> {
  const parser = get_parser({
    transformer: {
      start: (values: unknown[]) => Array.from(values).flat(),
      extra_networks_prompts: (values: unknown[]) => Array.from(values).flat(),
      extra_networks: ([name, args]: [string, string[]]): ExtraNetworksPrompt => {
        if (name !== "lora") return { type: "extra-networks", name, args };
        const weight = getOption("extra_networks_default_multiplier", 1).toString();
        return {
          type: "extra-networks",
          name,
          args: args.length === 1 ? [args[0], weight] : args,
        };
      },
      extra_networks_name: ([{ value }]: Array<{ value: string }>) => value.toLowerCase().trim(),
      extra_networks_args: (values: Array<{ value: string }>) => values.map((x) => x.value.trim()),
      multiple: (values: unknown[]) => Array.from(values).flat(),
      combination: (values: BasicPrompt[]): PromptCombination | PlainPrompt => {
        if (values.every((value) => value.type === "plain")) {
          return {
            type: "plain",
            value: (values as PlainPrompt[]).map(({ value }) => value).join(" "),
          };
        }
        return { type: "combination", values };
      },
      alternate: (values: InnerPrompt[]): AlternatePrompt => ({ type: "alternate", values }),
      scheduled_full: (values: [InnerPrompt, InnerPrompt, number]): ScheduledPrompt => ({
        type: "scheduled",
        from: values[0],
        to: values[1],
        when: values[2],
      }),
      scheduled_to: (values: [InnerPrompt, number]): ScheduledPrompt => ({
        type: "scheduled",
        to: values[0],
        when: values[1],
      }),
      scheduled_from: (values: [InnerPrompt, number]): ScheduledPrompt => ({
        type: "scheduled",
        from: values[0],
        when: values[1],
      }),
      emphasized_positive: ([value]: [OneOrMany<InnerPrompt>]): EmphasizedPrompt => ({
        type: "emphasized-positive",
        values: Array.isArray(value) ? value : [value],
      }),
      emphasized_negative: ([value]: [OneOrMany<InnerPrompt>]): EmphasizedPrompt => ({
        type: "emphasized-negative",
        values: Array.isArray(value) ? value : [value],
      }),
      emphasized_weighted: ([value, weight]: [
        OneOrMany<InnerPrompt>,
        number
      ]): EmphasizedPrompt => ({
        type: "emphasized-weighted",
        values: Array.isArray(value) ? value : [value],
        weight,
      }),
      plain: ([{ value }]): PlainPrompt => ({ type: "plain", value: String(value).trim() }),
      number: ([{ value }]) => Number(value),
    },
  });

  try {
    return parser.parse(text) as Prompt[];
  } catch {
    return null;
  }
}
