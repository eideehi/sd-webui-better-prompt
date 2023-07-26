import type { EmphasizedNegativePrompt, EmphasizedPositivePrompt, Prompt } from "#/prompt";
import Big from "big.js";
import { toString } from "#/prompt";
import { purgeEmphasizedPrompt } from "@/prompt-edit/_logic/purgeEmphasizedPrompt";

export function getWeight(prompt: Prompt): number {
  switch (prompt.type) {
    case "plain":
      return 1;
    case "emphasized-positive":
      return getPositiveWeight(prompt, 1);
    case "emphasized-negative":
      return getNegativeWeight(prompt, 1);
    case "emphasized-weighted":
      return prompt.weight;
    case "extra-networks":
      if (prompt.name !== "lora") break;
      return Number(prompt.args[1]);
  }
  return NaN;
}

function getPositiveWeight(prompt: EmphasizedPositivePrompt, weight: number): number {
  const value = new Big(weight).mul(1.1).round(2, 1).toNumber();
  if (prompt.values.length !== 1) return value;
  const child = prompt.values[0];
  if (child.type !== "emphasized-positive") return value;
  return getPositiveWeight(child, value);
}

function getNegativeWeight(prompt: EmphasizedNegativePrompt, weight: number): number {
  const value = new Big(weight).div(1.1).round(2, 1).toNumber();
  if (prompt.values.length !== 1) return value;
  const child = prompt.values[0];
  if (child.type !== "emphasized-negative") return value;
  return getNegativeWeight(child, value);
}

export function updateWeight(prompt: Prompt, weight: number): Prompt {
  switch (prompt.type) {
    case "plain":
      if (weight === 1) break;
      return { type: "emphasized-weighted", weight, values: [prompt] };
    case "emphasized-positive":
    case "emphasized-negative":
      if (weight === 1) return { type: "plain", value: toString(purgeEmphasizedPrompt(prompt)) };
      return { type: "emphasized-weighted", weight, values: purgeEmphasizedPrompt(prompt) };
    case "emphasized-weighted":
      if (weight === 1) return { type: "plain", value: toString(prompt.values) };
      prompt.weight = weight;
      break;
    case "extra-networks":
      if (prompt.name !== "lora") break;
      prompt.args[1] = weight.toString();
      break;
  }
  return prompt;
}
