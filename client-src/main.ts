import "./styles/index.css";
import { checkForUpdates, getDanbooruTags, getLocalization, getMyPrompts } from "@/libs/api";
import { getElement, hasElement } from "@/libs/util/dom";
import { getCurrentTabName, t, withBooleanOption } from "@/libs/util/webui";
import { initDanbooruTags } from "#/better-prompt/_logic/danbooruTags";
import { initMyPrompts } from "#/better-prompt/_logic/myPrompts";
import Toast, { showToast } from "#/widgets/Toast.svelte";
import BetterPrompt from "#/better-prompt/BetterPrompt.svelte";

let fetchLocalization: Nullable<Promise<void>> = null;
let fetchDanbooruTags: Nullable<Promise<void>> = null;
let fetchMyPrompts: Nullable<Promise<void>> = null;
let updateChecked = false;

function initWidgets(): void {
  if (!hasElement("#better-prompt-toast")) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    new Toast({ target: gradioApp() });
  }
}

function initialize(tabName: ExtensionAvailableTab): void {
  void Promise.all([fetchLocalization, fetchDanbooruTags, fetchMyPrompts]).then(() => {
    initBetterPrompt(tabName);
    checkExtensionUpdate();
  });
}

function initBetterPrompt(tabName: ExtensionAvailableTab): void {
  if (hasElement(`#${tabName}-better-prompt`)) return;

  const anchor = getElement(`#${tabName}_toprow + div`);
  if (anchor == null || anchor.parentElement == null) return;
  new BetterPrompt({ target: anchor.parentElement, anchor, props: { tabName } });
}

function checkExtensionUpdate(): void {
  if (updateChecked) return;
  updateChecked = true;

  withBooleanOption("better_prompt_update_notify_enabled", (value) => {
    if (!value) return;
    void checkForUpdates().then(({ update, version }) => {
      if (!update || version == null) return;
      showToast({ text: t("Better Prompt version {0} is available", version) });
    });
  });
}

function hiddenOriginalComponents(tabName: ExtensionAvailableTab): void {
  withBooleanOption("better_prompt_hide_original_prompt", (value) => {
    const element = getElement(`#${tabName}_toprow`);
    if (element) {
      element.dataset.hiddenOriginal = value ? "true" : "false";
    }
  });
}

onUiLoaded(() => {
  fetchLocalization = getLocalization().then((value) => {
    Object.assign(localization, { ...value });
  });

  fetchDanbooruTags = getDanbooruTags().then((value) => {
    initDanbooruTags(value);
  });

  fetchMyPrompts = getMyPrompts().then((value) => {
    initMyPrompts(value);
  });

  initWidgets();
});

onUiTabChange(() => {
  const tabName = getCurrentTabName();
  if (tabName !== "other") {
    initialize(tabName);
  }
});

onUiUpdate(() => {
  const tabName = getCurrentTabName();
  if (tabName !== "other") {
    hiddenOriginalComponents(tabName);
  }
});

export default {};
