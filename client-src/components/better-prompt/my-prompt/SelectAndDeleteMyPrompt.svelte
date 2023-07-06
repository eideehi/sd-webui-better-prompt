<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import { removeMyPrompts } from "#/better-prompt/_logic/myPrompts";
  import {
    cancelMyPromptDeletion,
    deleteSelectedMyPrompt,
    selectAndDeleteMyPrompt,
  } from "#/better-prompt/_logic/messages";

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
