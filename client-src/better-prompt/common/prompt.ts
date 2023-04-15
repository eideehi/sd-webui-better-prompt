import { EmphasizedPrompt, ExtraNetworksPrompt, Prompt, ScheduledPrompt } from "@/libs/prompt";

export function promptToString(prompt: Prompt): string {
  switch (prompt.type) {
    case "plain":
      return prompt.value;
    case "emphasized":
      return emphasizedPromptAsString(prompt);
    case "scheduled":
      return scheduledPromptAsString(prompt);
    case "extranetworks":
      return extraNetworksPromptAsString(prompt);
    case "whitespace":
      return " ";
  }
}

function emphasizedPromptAsString(prompt: EmphasizedPrompt): string {
  let stringPrompt = "";
  let prevType = "";
  prompt.values.forEach((value) => {
    const type = value.type;
    if (prevType === type && type === "plain") {
      stringPrompt += ", ";
    }
    stringPrompt += promptToString(value);
    prevType = type;
  });
  if (prompt.multiplier != null) {
    return `(${stringPrompt}:${prompt.multiplier.toFixed(2)})`;
  }
  return prompt.negative ? `[${stringPrompt}]` : `(${stringPrompt})`;
}

function scheduledPromptAsString(prompt: ScheduledPrompt): string {
  let stringPrompt = "[";
  if (prompt.from != null) {
    const from = promptToString(prompt.from).trim();
    stringPrompt += `${from}:`;
  }
  stringPrompt += `${prompt.to != null ? promptToString(prompt.to) : ""}:`;
  stringPrompt += `${prompt.when}]`;
  return stringPrompt;
}

function extraNetworksPromptAsString(prompt: ExtraNetworksPrompt): string {
  let stringPrompt = "<";
  if (prompt.args.length > 0) {
    stringPrompt += prompt.args[0];
  }
  for (let i = 1; i < prompt.args.length; i++) {
    stringPrompt += `:${prompt.args[i]}`;
  }
  stringPrompt += ">";
  return stringPrompt;
}
