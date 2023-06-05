<script lang="ts">
  import type { DanbooruTag } from "@/libs/danbooru";
  import { getContext } from "svelte";
  import { tagToPrompt } from "@/libs/danbooru";
  import { type BetterPromptContext, betterPromptContextKey } from "#/better-prompt/_logic/context";
  import {
    type PromptInputContext,
    promptInputContextKey,
  } from "#/better-prompt/input/_logic/context";

  export let data: DanbooruTag;
  export let index: number;

  let ref: Nullable<HTMLButtonElement> = null;

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
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (event.button !== 0) return;
    (event.shiftKey ? negative : positive).update((prompts) => {
      prompts.push({
        type: "plain",
        value: tagToPrompt(data.name),
      });
      return prompts;
    });
  }

  const toLabel = (tag: DanbooruTag) => {
    return `${tag.name.replaceAll("_", " ")}`;
  };

  const toCount = (tag: DanbooruTag) => {
    let count = tag.post_count;
    if (count >= 1000000) {
      count /= 1000000;
      const str = count.toFixed(count < 10.0 ? 1 : 0);
      return `${str}M`;
    } else if (count >= 1000) {
      count /= 1000;
      const str = count.toFixed(count < 10.0 ? 1 : 0);
      return `${str}k`;
    } else {
      return count.toString();
    }
  };
</script>

<button
  bind:this={ref}
  class="prompt-item suggest-item"
  data-category={data.category}
  on:click={onClick}
>
  <span class="label">{toLabel(data)}</span>
  <span class="count">{toCount(data)}</span>
</button>

<style lang="postcss">
  .suggest-item {
    @apply cursor-pointer truncate;
  }

  .suggest-item:focus-visible {
    @apply outline-none;
  }

  .suggest-item {
    @apply flex gap-2 border-[--danbooru-border-color] [background:--danbooru-background];
  }

  .suggest-item > span {
    @apply pointer-events-none;
  }

  .suggest-item[data-category="0"] > .label {
    @apply text-[--danbooru-general-text-color];
  }

  .suggest-item[data-category="1"] > .label {
    @apply text-[--danbooru-artist-text-color];
  }

  .suggest-item[data-category="3"] > .label {
    @apply text-[--danbooru-copyright-text-color];
  }

  .suggest-item[data-category="4"] > .label {
    @apply text-[--danbooru-character-text-color];
  }

  .suggest-item > .count {
    @apply text-[--danbooru-count-text-color];
  }
</style>
