import "./styles/index.css";
import { getDanbooruTags, getLocalization } from "./libs/api";
import { getElement } from "./libs/dom";
import { getCurrentTabName, withBooleanOption } from "./libs/webui";
import { createMainComponents, initDanbooruTags, initExtraNetworksData } from "@/better-prompt";
import { checkForUpdates } from "@/better-prompt/checkForUpdates";
import { initUndoRedo } from "@/better-prompt/common/undoRedo";

let fetchLocalization: Promise<void> | null = null;
let fetchDanbooruTags: Promise<void> | null = null;

const initialized: Record<PromptAvailableTab, boolean> = {
  txt2img: false,
  img2img: false,
};

function initialize(tabName: PromptAvailableTab) {
  if (initialized[tabName]) return;
  initialized[tabName] = true;

  Promise.all([fetchLocalization, fetchDanbooruTags]).then(() => {
    initExtraNetworksData(tabName);
    initUndoRedo(tabName);
    createMainComponents(tabName);
    checkForUpdates();
  });
}

function hiddenOriginalComponents(tabName: PromptAvailableTab) {
  withBooleanOption("better_prompt_hide_original_prompt", (value) => {
    const element = getElement(`#${tabName}_toprow`);
    if (element) {
      element.dataset.hiddenPrompt = value ? "true" : "false";
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

export {};
