import type { PlainPrompt } from "./plainPrompt";
import type { EmphasizedPrompt } from "./emphasizedPrompt";
import type { ScheduledPrompt } from "./scheduledPrompt";
import type { ExtraNetworksPrompt } from "./extraNetworksPrompt";
import type { WhiteSpacePrompt } from "./whiteSpacePrompt";

export type AllPrompt =
  | PlainPrompt
  | EmphasizedPrompt
  | ScheduledPrompt
  | ExtraNetworksPrompt
  | WhiteSpacePrompt;
