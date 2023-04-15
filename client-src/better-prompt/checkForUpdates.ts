import { checkForUpdates as checkForUpdatesApi } from "@/libs/api";
import { showToast } from "@/libs/toast";
import { _, withBooleanOption } from "@/libs/webui";

let checked = false;

export function checkForUpdates(): void {
  if (checked) return;
  checked = true;

  withBooleanOption("better_prompt_update_notify_enabled", (value) => {
    if (!value) return;
    checkForUpdatesApi().then((result) => {
      if (result.update) {
        showToast(_("Better Prompt version {0} is available", result.version), "info", {
          duration: -1,
          align: "right",
        });
      }
    });
  });
}
