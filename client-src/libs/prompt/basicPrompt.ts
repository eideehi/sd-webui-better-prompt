import type { AlternatePrompt } from "./alternatePrompt";
import type { EmphasizedPrompt } from "./emphasizedPrompt";
import type { PlainPrompt } from "./plainPrompt";
import type { ScheduledPrompt } from "./scheduledPrompt";

export type BasicPrompt = AlternatePrompt | EmphasizedPrompt | PlainPrompt | ScheduledPrompt;
