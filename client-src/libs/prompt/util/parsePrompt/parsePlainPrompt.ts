import type { PlainPrompt } from "#/prompt";

export function parsePlainPrompt(text: string): [Nullable<PlainPrompt>, string] {
  let value = "";

  let i: number;
  for (i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === " " || c === "\r" || c === "\n" || c === ",") {
      if (value.length !== 0) break;
    } else {
      value += c;
    }
  }

  if (value.length === 0) return [null, ""];
  return [{ type: "plain", value }, text.slice(i)];
}
