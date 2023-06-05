<script lang="ts">
  import type { Prompt } from "@/libs/prompt";
  import { createDataset, getTextContent, isPopupEnabled } from "./_logic/listItem";
  import Popup from "#/widgets/Popup.svelte";
  import WeightInput from "#/better-prompt/editor/prompt-list/WeightInput.svelte";

  export let prompt: Prompt;

  let ref: HTMLElement;

  let showPopup = false;

  function onContextmenu(event: MouseEvent): void {
    if (event.ctrlKey) return;
    if (!isPopupEnabled(prompt)) return;
    event.preventDefault();
    showPopup = !showPopup;
  }
</script>

<button
  {...createDataset(prompt)}
  bind:this={ref}
  class="prompt-item"
  on:click
  on:contextmenu={onContextmenu}
>
  {getTextContent(prompt)}
</button>

{#if ref != null}
  <Popup parent={ref} bind:show={showPopup}>
    <WeightInput bind:prompt />
  </Popup>
{/if}

<style lang="postcss">
  .prompt-item {
    @apply cursor-grab;
  }
</style>
