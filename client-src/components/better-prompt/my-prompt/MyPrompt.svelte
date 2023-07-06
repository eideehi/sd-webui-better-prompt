<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import Fuse from "fuse.js";
  import { myPrompts } from "#/better-prompt/_logic/myPrompts";
  import { emptyMyPrompt, searchMyPrompts } from "#/better-prompt/_logic/messages";
  import MyPromptItem from "./MyPromptItem.svelte";
  import TextInput from "#/widgets/TextInput.svelte";
  import Pagenation from "#/widgets/Pagenation.svelte";
  import AddNewMyPrompt from "./AddNewMyPrompt.svelte";
  import SelectAndDeleteMyPrompt from "./SelectAndDeleteMyPrompt.svelte";

  export let active: boolean;

  let addNewMyPrompt: Nullable<AddNewMyPrompt> = null;

  let searchKeyword = "";
  let fuse: Fuse<MyPrompt>;
  $: fuse = new Fuse($myPrompts, {
    useExtendedSearch: true,
    threshold: 0.1,
    keys: ["label", "tags", "prompt"],
  });

  let displayableMyPrompts: MyPrompt[];
  $: {
    if (searchKeyword) {
      displayableMyPrompts = [];
      fuse.search(searchKeyword).forEach((result) => {
        displayableMyPrompts.push(result.item);
      });
    } else {
      displayableMyPrompts = [...$myPrompts];
    }
  }

  let page = 1;
  let displayLimit = 20;

  let displayMyPrompts: MyPrompt[];
  $: {
    displayMyPrompts = [];
    const offset = (page - 1) * displayLimit;
    const max = offset + displayLimit;
    for (let i = offset; i < max; i++) {
      if (i >= displayableMyPrompts.length) break;
      displayMyPrompts.push(displayableMyPrompts[i]);
    }
  }

  let deleteMode = false;
  let selectedMyPrompts: MyPrompt[] = [];

  $: if (!active) {
    deleteMode = false;
    if (addNewMyPrompt != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      addNewMyPrompt.closePopup();
    }
  }

  $: {
    if (deleteMode) {
      if (addNewMyPrompt != null) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        addNewMyPrompt.closePopup();
      }
    } else {
      selectedMyPrompts = [];
    }
  }

  function onMyPromptSelect(event: CustomEvent<{ selected: boolean; myPrompt: MyPrompt }>): void {
    const { selected, myPrompt } = event.detail;
    const index = selectedMyPrompts.indexOf(myPrompt);
    if (selected && index === -1) {
      selectedMyPrompts = [...selectedMyPrompts, myPrompt];
    } else if (!selected && index >= 0) {
      selectedMyPrompts.splice(index, 1);
      selectedMyPrompts = [...selectedMyPrompts];
    }
  }
</script>

<div class="my-prompt" class:active>
  <div class="tools">
    <TextInput bind:value={searchKeyword} options={{ placeholder: searchMyPrompts.translate() }} />
    <AddNewMyPrompt bind:this={addNewMyPrompt} on:popupopen={() => (deleteMode = false)} />
    {#if $myPrompts.length > 0}
      <SelectAndDeleteMyPrompt bind:deleteMode bind:selectedMyPrompts />
    {/if}
  </div>
  {#if displayableMyPrompts.length > 0}
    <Pagenation bind:page totalCount={displayableMyPrompts.length} {displayLimit} />
    <div class="my-prompt-views">
      {#each displayMyPrompts as myPrompt}
        <MyPromptItem {myPrompt} selectable={deleteMode} on:change={onMyPromptSelect} />
      {/each}
    </div>
    <Pagenation bind:page totalCount={displayableMyPrompts.length} {displayLimit} />
  {:else if $myPrompts.length === 0}
    <div class="empty-my-prompts">
      {emptyMyPrompt.translate()}
    </div>
  {/if}
</div>

<style lang="postcss">
  .my-prompt {
    @apply hidden w-full flex-col gap-[--layout-gap];
  }

  .my-prompt.active {
    @apply flex;
  }

  .tools {
    @apply flex flex-wrap gap-1.5;
  }

  .empty-my-prompts {
    @apply text-2xl;
  }

  .my-prompt-views {
    @apply flex flex-wrap gap-[1.5rem];
  }
</style>
