import type { PlainPrompt, Prompt, PromptGroup, Prompts } from "#/prompt";
import { parseAlternatePrompt } from "./parseAlternatePrompt";
import { parseEmphasizedPrompt } from "./parseEmphasizedPrompt";
import { parseExtraNetworks } from "./parseExtraNetworks";
import { parsePlainPrompt } from "./parsePlainPrompt";
import { parseScheduledPrompt } from "./parseScheduledPrompt";

type ParseFunction = (text: string) => [Nullable<Prompt>, string];

export function parsePrompt(text: string): Prompts {
  function mergePlainPrompts(group: PromptGroup): PromptGroup {
    if (!group.every((prompt) => prompt.type === "plain")) return group;
    return [
      {
        type: "plain",
        value: group.map((prompt) => (prompt as PlainPrompt).value).join(" "),
      },
    ];
  }

  const result: Prompts = [];

  const functions: ParseFunction[] = [
    parseExtraNetworks,
    parseAlternatePrompt,
    parseScheduledPrompt,
    parseEmphasizedPrompt,
    parsePlainPrompt,
  ];

  let buf: PromptGroup = [];
  while (text.length > 0) {
    let offset = 0;
    while (text[offset] === " ") offset++;

    if (text[offset] === ",") {
      result.push(mergePlainPrompts(buf));
      buf = [];
      offset++;
    }
    text = text.slice(offset);

    const parseSuccess = functions.some((parse) => {
      const [prompt, remaining] = parse(text);
      if (prompt != null) {
        buf.push({ ...prompt });
        text = remaining;
        return true;
      }
      return false;
    });

    if (!parseSuccess) break;
  }

  if (buf.length > 0) {
    result.push(mergePlainPrompts(buf));
  }
  return result;
}
