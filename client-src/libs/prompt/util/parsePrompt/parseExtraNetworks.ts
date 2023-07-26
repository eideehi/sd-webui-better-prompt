import type { ExtraNetworksPrompt } from "#/prompt";

export function parseExtraNetworks(text: string): [Nullable<ExtraNetworksPrompt>, string] {
  let state = 0;
  let buf = "";

  let name = "";
  const args: string[] = [];

  let i: number;
  for (i = 0; i < text.length; i++) {
    const c = text[i];
    if (state === 0) {
      if (c === " " || c === "\r" || c === "\n") continue;
      if (c !== "<") return [null, text];
      state = 1;
    } else if (state === 1) {
      if (c === " " || c === "\r" || c === "\n" || c === ">") return [null, text];
      if (c === ":") {
        state = 2;
        name = buf;
        buf = "";
      } else {
        buf += c;
      }
    } else if (state === 2) {
      if (c === ">") {
        args.push(buf);
        break;
      } else if (c === ":") {
        args.push(buf);
        buf = "";
      } else {
        buf += c;
      }
    }
  }

  if (args.length === 0 || (args.length === 1 && args[0].length === 0)) return [null, text];
  return [{ type: "extra-networks", name, args }, text.slice(i + 1)];
}
