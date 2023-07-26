import type {
  NegativeEmphasizedPrompt,
  PositiveEmphasizedPrompt,
  WeightedEmphasizedPrompt,
} from "#/prompt";
import { parsePrompt } from "./parsePrompt";

type EmphasizedPrompt =
  | PositiveEmphasizedPrompt
  | NegativeEmphasizedPrompt
  | WeightedEmphasizedPrompt;

export function parseEmphasizedPrompt(text: string): [Nullable<EmphasizedPrompt>, string] {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " || text[i] === "\r" || text[i] === "\n") continue;
    let [prompt, _text] = parseNegative(text, i);
    if (prompt != null) return [prompt, _text];
    [prompt, _text] = parsePositiveOrWeighted(text, i);
    if (prompt != null) return [prompt, _text];
    break;
  }
  return [null, text];
}

function parsePositiveOrWeighted(
  text: string,
  offset: number
): [Nullable<EmphasizedPrompt>, string] {
  if (text[offset] !== "(") return [null, text];

  let i = offset + 1;
  let nest = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "(") {
      nest++;
    } else if (c === ")") {
      if (nest === 0) {
        const part = text.slice(offset + 1, i);
        const colon = part.lastIndexOf(":");

        if (colon != -1) {
          const num = part.slice(colon + 1, part.length);
          if (/^[+-]?\d+(\.\d*)?$/.test(num)) {
            return [
              {
                type: "emphasized",
                subType: "weighted",
                weight: parseFloat(num),
                values: parsePrompt(part.slice(0, colon)),
              },
              text.slice(i + 1),
            ];
          }
        }

        return [
          {
            type: "emphasized",
            subType: "positive",
            values: parsePrompt(part),
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

function parseNegative(text: string, offset: number): [Nullable<EmphasizedPrompt>, string] {
  if (text[offset] !== "[") return [null, text];

  let i = offset + 1;
  let nest = 0;
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "[") {
      nest++;
    } else if (c === "]") {
      if (nest === 0) {
        return [
          {
            type: "emphasized",
            subType: "negative",
            values: parsePrompt(text.slice(offset + 1, i)),
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
