<script lang="ts">
  import type { Prompt } from "@/libs/prompt";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { t } from "@/libs/util/webui";
  import { createLoraReadable, createTextualInversionReadable } from "./_logic/betterPrompt";
  import { type BetterPromptContext, betterPromptContextKey } from "./_logic/context";
  import PromptEdit from "./prompt-edit/PromptEdit.svelte";
  import MyPrompt from "./my-prompt/MyPrompt.svelte";

  export let tabName: ExtensionAvailableTab;

  const positive = writable<Prompt[]>([]);
  const negative = writable<Prompt[]>([]);

  setContext<BetterPromptContext>(betterPromptContextKey, {
    tabName,
    prompts: { positive, negative },
    extraNetworksData: {
      lora: createLoraReadable(tabName),
      textualInversion: createTextualInversionReadable(tabName),
    },
  });

  type BetterPromptTab = "prompt-edit" | "my-prompt";
  let activeTab: BetterPromptTab = "prompt-edit";
  const openTab = (tab: BetterPromptTab) => () => (activeTab = tab);
</script>

<div class="better-prompt" id="{tabName}-better-prompt">
  <div class="tabs scroll-hide">
    <button
      class="tab"
      class:selected={activeTab === "prompt-edit"}
      on:click={openTab("prompt-edit")}
    >
      {t("prompt-edit", { defaultValue: "Prompt Edit" })}
    </button>
    <button class="tab" class:selected={activeTab === "my-prompt"} on:click={openTab("my-prompt")}>
      {t("my-prompt", { defaultValue: "My Prompt" })}
    </button>
  </div>
  <div class="content-area">
    <PromptEdit active={activeTab === "prompt-edit"} />
    <MyPrompt active={activeTab === "my-prompt"} />
  </div>
</div>

<style lang="postcss">
  .better-prompt {
    @apply w-full;
  }

  .tabs {
    @apply flex flex-wrap whitespace-nowrap border-b border-solid border-[--border-color-primary];
  }

  .tab {
    @apply -mb-[1px] rounded-t-[--container-radius] border border-b-0 border-solid border-transparent px-[--size-4] py-[--size-1] text-[length:--section-header-text-size] font-[--section-header-text-weight] text-[--body-text-color-subdued];
  }

  .tab.selected {
    @apply border-[--border-color-primary] text-[--body-text-color] [background:--background-fill-primary];
  }

  .tab:not(.active):hover {
    @apply text-[--body-text-color];
  }

  .content-area {
    @apply rounded-b-[--container-radius] border border-t-0 border-solid border-[--border-color-primary] p-[--block-padding];
  }
</style>
