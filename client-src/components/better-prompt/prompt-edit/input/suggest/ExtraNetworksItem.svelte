<script lang="ts">
  import type { ExtraNetworksData } from "@/libs/extra-networks";
  import { getContext } from "svelte";
  import { getOption } from "@/libs/util/webui";
  import { type BetterPromptContext, betterPromptContextKey } from "#/better-prompt/_logic/context";
  import { loraNegativePromptError } from "#/better-prompt/_logic/messages";
  import {
    type PromptInputContext,
    promptInputContextKey,
  } from "#/better-prompt/prompt-edit/input/_logic/context";
  import { showToast } from "#/widgets/Toast.svelte";
  import Popup from "#/widgets/Popup.svelte";

  export let data: ExtraNetworksData;
  export let index: number;

  let ref: Nullable<HTMLButtonElement> = null;
  let showPopup = false;

  const {
    prompts: { positive, negative },
  } = getContext<BetterPromptContext>(betterPromptContextKey);
  const { pseudoFocus, currentFocus } = getContext<PromptInputContext>(promptInputContextKey);

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

      const isLora = data.type === "lora";
      if (isLora && shiftKey) {
        showToast({
          type: "warning",
          text: loraNegativePromptError.translate(),
        });
        return;
      }

      (shiftKey ? negative : positive).update((prompts) => {
        prompts.push({
          type: "extra-networks",
          name: data.type,
          args: isLora
            ? [data.name, getOption("extra_networks_default_multiplier", 1).toString()]
            : [data.name],
        });
        return prompts;
      });
    }
  }

  function showLoraMetadata(event: Event): void {
    extraNetworksRequestMetadata(event, "lora", data.name);
  }
</script>

<button
  bind:this={ref}
  class="prompt-item suggest-item"
  data-extra-networks={data.type}
  on:click={onClick}
  on:contextmenu|preventDefault={() => (showPopup = !showPopup)}
>
  {data.name}
</button>

{#if ref != null}
  <Popup parent={ref} bind:show={showPopup}>
    <div class="thumbnail-preview">
      <div
        class="thumbnail-card"
        style:background-image={data.thumbnail || "url(/file=html/card-no-preview.png)"}
      >
        {#if data.type === "lora"}
          <button class="metadata-button" on:click={showLoraMetadata} />
        {/if}
      </div>
    </div>
  </Popup>
{/if}

<style lang="postcss">
  .suggest-item {
    @apply cursor-pointer truncate;
  }

  .suggest-item:focus-visible {
    @apply outline-none;
  }

  .thumbnail-card {
    @apply relative m-[0.5em] inline-block h-[24em] w-[16em] cursor-default overflow-hidden rounded-[0.2rem] bg-[auto_100%] bg-center text-[length:--text-md];
  }

  .metadata-button {
    @apply cursor-pointer border-none bg-transparent;
  }
</style>
