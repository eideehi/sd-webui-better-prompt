import type { ScheduledPrompt } from "#/prompt";
import { parsePrompt } from "./parsePrompt";

export function parseScheduledPrompt(text: string): [Nullable<ScheduledPrompt>, string] {
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " " || text[i] === "\r" || text[i] === "\n") continue;
    const [prompt, _text] = parse(text, i);
    if (prompt != null) return [prompt, _text];
    break;
  }
  return [null, text];
}

function parse(text: string, offset: number): [Nullable<ScheduledPrompt>, string] {
  if (text[offset] !== "[") return [null, text];

  let i = offset + 1;
  let bracketNest = 0;
  let parenthesisNest = 0;
  const colons: number[] = [];
  for (; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "(") {
      parenthesisNest++;
    } else if (c === ")") {
      parenthesisNest--;
    } else if (c === "[") {
      bracketNest++;
    } else if (c === ":") {
      if (bracketNest > 0 || parenthesisNest > 0) continue;
      colons.push(i);
    } else if (c === "]") {
      if (bracketNest > 0) {
        bracketNest--;
      } else {
        if (colons.length === 1) {
          const to = text.slice(offset + 1, colons[0]);
          if (to.length === 0) break;
          const num = text.slice(colons[0] + 1, i);
          if (/^\s*[+-]?\d+(\.\d*)?$/.test(num)) {
            return [
              {
                type: "scheduled",
                to: parsePrompt(to),
                when: parseFloat(num),
              },
              text.slice(i + 1),
            ];
          }
        } else if (colons.length === 2) {
          const from = text.slice(offset + 1, colons[0]);
          const to = text.slice(colons[0] + 1, colons[1]);
          if (to.length === 0) {
            if (from.length === 0) break;
          }
          const num = text.slice(colons[1] + 1, i);
          if (/^\s*[+-]?\d+(\.\d*)?$/.test(num)) {
            if (to.length === 0) {
              return [
                {
                  type: "scheduled",
                  from: parsePrompt(from),
                  when: parseFloat(num),
                },
                text.slice(i + 1),
              ];
            } else {
              return [
                {
                  type: "scheduled",
                  from: parsePrompt(from),
                  to: parsePrompt(to),
                  when: parseFloat(num),
                },
                text.slice(i + 1),
              ];
            }
          }
        } else {
          break;
        }
      }
    }
  }

  return [null, text];
}
