import { type ExtraNetworksPrompt, type Prompt, toString } from "#/prompt";
import {
  alternatePromptToString,
  emphasizedNegativePromptToString,
  emphasizedPositivePromptToString,
  plainPromptToString,
  promptCombinationToString,
  scheduledPromptToString,
} from "#/prompt/util/toString";

export function getTextContent(prompt: Prompt): string {
  return promptToText(prompt).replaceAll("\\", "");
}

function promptToText(prompt: Prompt): string {
  switch (prompt.type) {
    case "alternate":
      return alternatePromptToString(prompt);
    case "combination":
      return promptCombinationToString(prompt);
    case "emphasized-positive":
      return emphasizedPositivePromptToString(prompt);
    case "emphasized-negative":
      return emphasizedNegativePromptToString(prompt);
    case "emphasized-weighted":
      return `${toString(prompt.values)}: ${prompt.weight}`;
    case "extra-networks":
      return extraNetworksPromptToText(prompt);
    case "plain":
      return plainPromptToString(prompt);
    case "scheduled":
      return scheduledPromptToString(prompt);
  }
  return "";
}

function extraNetworksPromptToText(prompt: ExtraNetworksPrompt): string {
  if (prompt.name === "textual-inversion") {
    return prompt.args[0];
  } else if (prompt.name === "lora") {
    return `${prompt.args[0]}: ${prompt.args[1]}`;
  }
  return toString(prompt);
}

export function createDataset(prompt: Prompt): object {
  const dataset = {};
  dataset["data-prompt-type"] = prompt.type;
  dataset["data-prompt-value"] = toString(prompt);
  switch (prompt.type) {
    case "extra-networks":
      dataset["data-extra-networks"] = prompt.name;
      break;
  }
  return dataset;
}
