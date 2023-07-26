<script lang="ts">
  import type { MyPrompt } from "#/my-prompt";
  import { getContext } from "svelte";
  import { parsePrompt, type Prompt } from "#/prompt";
  import { type BetterPromptContext, betterPromptContextKey } from "@/_logic/context";
  import { createDataset, getTextContent } from "@/_logic/prompt";
  import { adjustPrompt } from "@/_logic/adjustPrompt";
  import { textualInversion } from "@/_logic/extraNetworks";
  import {
    type PromptInputContext,
    promptInputContextKey,
  } from "@/prompt-edit/input/_logic/context";
  import Popup from "%/Popup.svelte";

  export let data: MyPrompt;
  export let index: number;

  const {
    prompts: { positive, negative },
  } = getContext<BetterPromptContext>(betterPromptContextKey);
  const { pseudoFocus, currentFocus } = getContext<PromptInputContext>(promptInputContextKey);

  let ref: Nullable<HTMLButtonElement> = null;

  let showPopup = false;

  let parsedPrompts: Prompt[];
  $: parsedPrompts = (parsePrompt(data.prompt) || []).map((prompt) =>
    adjustPrompt(prompt, $textualInversion)
  );

  pseudoFocus.subscribe((focus) => {
    if (focus !== index) return;
    if (ref === null) return;
    currentFocus.set(ref);
  });

  function onClick(event: MouseEvent): void {
    const { target, button, shiftKey } = event;
    if (!(target instanceof HTMLButtonElement)) return;

    if (button === 0) {
      showPopup = false;

      (shiftKey ? negative : positive).update((prompts) => {
        return [...prompts, ...parsedPrompts];
      });
    }
  }
</script>

<button
  bind:this={ref}
  class="prompt-item suggest-item"
  on:click={onClick}
  on:contextmenu|preventDefault={() => (showPopup = !showPopup)}
>
  {data.label}
</button>

{#if ref != null}
  <Popup parent={ref} bind:show={showPopup}>
    <div class="my-prompt-view">
      {#each parsedPrompts as prompt}
        <div {...createDataset(prompt)} class="prompt-item">
          {getTextContent(prompt)}
        </div>
      {/each}
    </div>
  </Popup>
{/if}

<style lang="postcss">
  .my-prompt-view {
    @apply flex flex-wrap gap-1.5;
  }
</style>
