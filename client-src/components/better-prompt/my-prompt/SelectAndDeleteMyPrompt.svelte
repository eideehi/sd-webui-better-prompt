<script lang="ts">
  import type { MyPrompt } from "#/my-prompt";
  import { removeMyPrompts } from "@/_logic/myPrompts";
  import {
    cancelMyPromptDeletion,
    deleteSelectedMyPrompt,
    selectAndDeleteMyPrompt,
  } from "@/_logic/messages";

  export let deleteMode: boolean;
  export let selectedMyPrompts: MyPrompt[];

  function deleteMyPrompts(): void {
    if (!deleteMode) return;
    if (selectedMyPrompts.length === 0) return;

    removeMyPrompts(selectedMyPrompts);
    deleteMode = false;
    selectedMyPrompts = [];
  }
</script>

<button class="button secondary lg" on:click={() => (deleteMode = !deleteMode)}>
  {#if deleteMode}
    {cancelMyPromptDeletion.translate()}
  {:else}
    {selectAndDeleteMyPrompt.translate()}
  {/if}
</button>

{#if deleteMode}
  <button
    class="button primary lg"
    on:click={deleteMyPrompts}
    disabled={selectedMyPrompts.length === 0}
  >
    {deleteSelectedMyPrompt.translate()}
  </button>
{/if}
