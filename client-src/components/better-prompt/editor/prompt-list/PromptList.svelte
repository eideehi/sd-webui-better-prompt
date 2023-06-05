<script lang="ts">
  import Sortable from "sortablejs";
  import { getContext, onMount } from "svelte";
  import { sortByIndexes } from "@/libs/util/array";
  import { getElementAll } from "@/libs/util/dom";
  import { type EditorContext, editorContextKey } from "#/better-prompt/editor/_logic/context";
  import { promptIdentifier } from "./_logic/promptList";
  import ListItem from "./ListItem.svelte";

  const { prompts } = getContext<EditorContext>(editorContextKey);

  const onItemClick =
    (index: number) =>
    (event: MouseEvent): void => {
      if (!event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      prompts.update((values) => values.filter((_, i) => i !== index));
    };

  let ref: Nullable<HTMLElement> = null;

  onMount(() => {
    if (ref == null) return;
    const sortable = new Sortable(ref, {
      animation: 150,
      swapThreshold: 1.1,
      ghostClass: "ghost",
      onSort: () => {
        if (ref == null) return;
        const indexes = getElementAll(ref, "li").map((element) => Number(element.dataset.index));
        prompts.set(sortByIndexes($prompts, indexes));
      },
    });
    return () => sortable.destroy();
  });
</script>

<ul bind:this={ref} class="prompt-list">
  {#each $prompts as prompt, i (promptIdentifier(i, prompt))}
    <li data-index={i}>
      <ListItem bind:prompt on:click={onItemClick(i)} />
    </li>
  {/each}
</ul>

<style lang="postcss">
  .prompt-list {
    @apply flex min-h-[84px] w-full list-none flex-wrap gap-2 rounded-[--input-radius] border-[length:--input-border-width] border-solid border-[--input-border-color] p-[--input-padding] text-[length:--input-text-size] font-[--input-text-weight] leading-[--line-sm] text-[--body-text-color] outline-none [background:--input-background-fill] [box-shadow:--input-shadow];
  }

  li:global(.ghost) {
    @apply opacity-50;
  }
</style>
