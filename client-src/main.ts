import "./styles/index.css";
import { getDanbooruTags, getExtraNetworks, getLocalization, getMyPrompts } from "#/api";
import { getElement, hasElement } from "#/util/dom";
import { getCurrentTabName, withBooleanOption } from "#/util/webui";
import { initDanbooruTags } from "@/_logic/danbooruTags";
import { initLora, initTextualInversion } from "@/_logic/extraNetworks";
import { initMyPrompts } from "@/_logic/myPrompts";
import Toast from "%/Toast.svelte";
import BetterPrompt from "@/BetterPrompt.svelte";

let fetchLocalization: Nullable<Promise<void>> = null;
let fetchDanbooruTags: Nullable<Promise<void>> = null;
let fetchMyPrompts: Nullable<Promise<void>> = null;

function initWidgets(): void {
  if (!hasElement("#eidee-net-toast-container")) {
    new Toast({ target: gradioApp() });
  }
}

function initialize(tabName: ExtensionAvailableTab): void {
  window.setTimeout(function init() {
    if (Object.keys(opts).length === 0) {
      window.setTimeout(init, 125);
      return;
    }

    void Promise.all([fetchLocalization, fetchDanbooruTags, fetchMyPrompts]).then(() => {
      initBetterPrompt(tabName);
    });
  }, 10);
}

function initBetterPrompt(tabName: ExtensionAvailableTab): void {
  if (hasElement(`#${tabName}-better-prompt`)) return;

  const anchor = getElement(`#${tabName}_toprow + div`);
  if (anchor == null || anchor.parentElement == null) return;
  new BetterPrompt({ target: anchor.parentElement, anchor, props: { tabName } });
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

  void getExtraNetworks("lora").then((value) => {
    initLora(value);
  });

  void getExtraNetworks("textual-inversion").then((value) => {
    initTextualInversion(value);
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
