import type { BasicPrompt } from "./basicPrompt";
import type { ExtraNetworksPrompt } from "./extraNetworksPrompt";
import type { PromptCombination } from "@/libs/prompt/promptCombination";

export type AllPrompt = BasicPrompt | PromptCombination | ExtraNetworksPrompt;
