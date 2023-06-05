<script lang="ts">
  import type { FilterType } from "./_logic/filters";
  import type { SuggestData } from "./_logic/suggest";
  import type { ExtraNetworksData } from "@/libs/extra-networks";
  import type { DanbooruTag } from "@/libs/danbooru";
  import Fuse from "fuse.js";
  import { getContext } from "svelte";
  import { writable } from "svelte/store";
  import { getElement, getElementAll, rotateElement } from "@/libs/util/dom";
  import { type BetterPromptContext, betterPromptContextKey } from "#/better-prompt/_logic/context";
  import { danbooruTags } from "#/better-prompt/_logic/danbooruTags";
  import {
    type PromptInputContext,
    promptInputContextKey,
  } from "#/better-prompt/input/_logic/context";
  import ListItem from "./ListItem.svelte";

  export let promptText: string;
  export let filters: FilterType[];

  const {
    extraNetworksData: { lora, textualInversion },
  } = getContext<BetterPromptContext>(betterPromptContextKey);
  const { pseudoFocus, movePseudoFocus } = getContext<PromptInputContext>(promptInputContextKey);

  let suggestsRef: Nullable<HTMLElement> = null;
  movePseudoFocus.subscribe((direction) => {
    movePseudoFocus.set(null);
    if (direction == null) return;
    if (suggestsRef == null) return;

    if (direction === "next" || direction === "previous") {
      let index = $pseudoFocus + (direction === "next" ? 1 : -1);
      const items = getElementAll(suggestsRef, "li");
      if (index < 0) {
        index = items.length - 1;
      } else if (index >= items.length) {
        index = 0;
      }
      pseudoFocus.set(index);
    } else {
      const selected = getElement(suggestsRef, `li[data-index="${$pseudoFocus}"]`);
      if (selected == null) {
        pseudoFocus.set(0);
        return;
      }
      const rotate = rotateElement(selected, direction);
      pseudoFocus.set(Number(rotate?.dataset.index || "0"));
    }
  });

  const suggests = writable<SuggestData[]>([]);

  let loraFuse: Fuse<ExtraNetworksData>;
  $: loraFuse = new Fuse($lora, {
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ["name", "search_term"],
  });

  let textualInversionFuse: Fuse<ExtraNetworksData>;
  $: textualInversionFuse = new Fuse($textualInversion, {
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ["name", "search_term"],
  });

  let danbooruTagFuse: Fuse<DanbooruTag>;
  $: danbooruTagFuse = new Fuse($danbooruTags, {
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ["name", "category"],
  });

  function updateSuggest() {
    if (!promptText || filters.length === 0) {
      suggests.set([]);
      return;
    }

    const results: SuggestData[] = [];
    const allowAllType = filters.includes("all");

    const limit = 20;
    let count = 0;
    const withinLimit = () => count < limit;

    if (withinLimit() && (allowAllType || filters.includes("textual-inversion"))) {
      textualInversionFuse.search(promptText, { limit: limit - count }).forEach(({ item }) => {
        results.push({ type: "extra-networks", value: item });
        count++;
      });
    }
    if (withinLimit() && (allowAllType || filters.includes("lora"))) {
      loraFuse.search(promptText, { limit: limit - count }).forEach(({ item }) => {
        results.push({ type: "extra-networks", value: item });
        count++;
      });
    }

    if (withinLimit()) {
      let tagCategory = "";
      if (allowAllType || filters.includes("danbooru-general")) {
        tagCategory += "'0|";
      }
      if (allowAllType || filters.includes("danbooru-copyright")) {
        tagCategory += "'3|";
      }
      if (allowAllType || filters.includes("danbooru-character")) {
        tagCategory += "'4|";
      }
      if (tagCategory.endsWith("|")) {
        tagCategory = tagCategory.slice(0, -1);
      }

      if (tagCategory) {
        danbooruTagFuse
          .search(
            { $and: [{ category: tagCategory }, { name: promptText }] },
            { limit: limit - count }
          )
          .forEach(({ item }) => {
            results.push({ type: "danbooru", value: item });
            count++;
          });
      }
    }

    suggests.set(results);
  }

  let updateId = -1;
  $: if (promptText || filters) {
    if (updateId !== -1) {
      window.clearTimeout(updateId);
    }
    updateId = window.setTimeout(updateSuggest, 500);
  }
</script>

<div class="suggest-list">
  <ul bind:this={suggestsRef} class="suggests">
    {#each $suggests as suggest, i}
      <li class:pseudo-focus={$pseudoFocus === i} data-index={i}>
        <ListItem index={i} data={suggest} />
      </li>
    {/each}
  </ul>
</div>

<style lang="postcss">
  .suggest-list {
    @apply m-0 min-h-[84px] w-full grow rounded-[--block-radius] border-[length:--block-border-width] border-[--block-border-color] leading-[--line-sm] [background:--block-background-fill] [box-shadow:--block-shadow];
  }

  .suggests {
    @apply flex list-none flex-wrap gap-2 p-[--input-padding];
  }

  .pseudo-focus :global(.suggest-item) {
    @apply outline outline-2 outline-offset-2 outline-[--input-background-fill-focus];
  }
</style>
