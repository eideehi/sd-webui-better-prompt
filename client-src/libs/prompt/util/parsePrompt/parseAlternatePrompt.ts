import type { AlternatePrompt, Prompts } from "#/prompt";
import { parsePrompt } from "./parsePrompt";

export function parseAlternatePrompt(text: string): [Nullable<AlternatePrompt>, string] {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " || text[i] === "\r" || text[i] === "\n") continue;
    const [prompt, _text] = parse(text, i);
    if (prompt != null) return [prompt, _text];
    break;
  }
  return [null, text];
}

function parse(text: string, offset: number): [Nullable<AlternatePrompt>, string] {
  if (text[offset] !== "[") return [null, text];

  const values: Prompts[] = [];

  let i = offset + 1;
  let nest = 0;
  let begin = i;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "[") {
      nest++;
    } else if (c === "|") {
      if (nest !== 0) continue;

      const part = text.slice(begin, i);
      if (part.length === 0) break;
      values.push(parsePrompt(part));

      begin = i + 1;
    } else if (c === "]") {
      if (nest === 0) {
        if (values.length === 0) break;

        const part = text.slice(begin, i);
        if (part.length === 0) break;
        values.push(parsePrompt(part));

        return [
          {
            type: "alternate",
            values,
          },
          text.slice(i + 1),
        ];
      } else {
        nest--;
      }
    }
  }

  return [null, text];
}
