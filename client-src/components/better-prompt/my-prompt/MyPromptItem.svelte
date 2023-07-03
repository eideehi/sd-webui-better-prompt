<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import { createEventDispatcher } from "svelte";
  import { parsePrompt, type Prompt } from "@/libs/prompt";
  import { t } from "@/libs/util/webui";
  import { textualInversion } from "#/better-prompt/_logic/extraNetworks";
  import { createDataset, getTextContent } from "#/better-prompt/_logic/prompt";
  import { adjustPrompt } from "#/better-prompt/_logic/adjustPrompt";

  export let myPrompt: MyPrompt;
  export let selectable = false;

  let prompts: Prompt[];
  $: prompts = (parsePrompt(myPrompt.prompt) || []).map((prompt) =>
    adjustPrompt(prompt, $textualInversion)
  );

  let selected = false;
  const dispatch = createEventDispatcher();

  function onClick(): void {
    if (!selectable) return;
    selected = !selected;
    dispatch("change", { selected, myPrompt });
  }

  let cache = myPrompt;
  $: if (!selectable || cache !== myPrompt) {
    selected = false;
    dispatch("change", { selected: false, myPrompt: cache });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="my-prompt-item" class:selectable class:selected on:click={onClick}>
  <div class="label">{myPrompt.label}</div>
  <div class="tags">
    <span class="tags-icon">🔖</span>
    {#if myPrompt.tags.length > 0}
      {#each myPrompt.tags as tag}
        <div class="tag">{tag}</div>
      {/each}
    {:else}
      <div class="tag empty">{t("my-prompt-tags-empty", { defaultValue: "No tags are set" })}</div>
    {/if}
  </div>
  <div class="prompt">
    {#each prompts as prompt}
      <div {...createDataset(prompt)} class="prompt-item">
        {getTextContent(prompt)}
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .my-prompt-item {
    @apply min-h-[144px] w-full min-w-[256px] max-w-[256px] transform-none rounded-[--container-radius] border-2 border-solid border-[--input-border-color] p-[--block-padding] shadow-none transition-[box-shadow_transform] duration-200 ease-in-out;
  }

  .my-prompt-item.selectable {
    @apply cursor-pointer shadow-md shadow-[rgba(0,0,0,0.33)] [transform:translate(0,-2px)_scale(1.01)];
  }

  :global(.dark) .my-prompt-item.selectable {
    @apply shadow-[rgba(0,0,0,0.66)];
  }

  .my-prompt-item.selectable:not(.selected):hover {
    @apply border-[--input-border-color-focus];
  }

  .my-prompt-item.selected {
    @apply [box-shadow:0_0_8px_var(--primary-500)];
  }

  .label {
    @apply text-2xl font-bold;
  }

  .tags {
    @apply mt-1 flex select-none flex-wrap items-center gap-1.5;
  }

  .tags-icon {
    @apply text-xl;
  }

  .tag {
    @apply flex items-center rounded-[--button-small-radius] border-[length:--checkbox-label-border-width] border-solid border-[--checkbox-label-border-color] px-2 py-0.5 text-[--checkbox-label-text-color] [background:--checkbox-label-background-fill];
  }

  .tag.empty {
    @apply opacity-75 [background:none];
  }

  .prompt {
    @apply mt-2 flex flex-wrap gap-1.5;
  }
</style>
