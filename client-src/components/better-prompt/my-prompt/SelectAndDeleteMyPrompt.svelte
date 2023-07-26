<script lang="ts">
  import type { MyPrompt } from "#/my-prompt";
  import { removeMyPrompts } from "@/_logic/myPrompts";
  import * as t from "~/messages";

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
    {t.CancelMyPromptDeletion()}
  {:else}
    {t.SelectAndDeleteMyPrompt()}
  {/if}
</button>

{#if deleteMode}
  <button
    class="button primary lg"
    on:click={deleteMyPrompts}
    disabled={selectedMyPrompts.length === 0}
  >
    {t.DeleteSelectedMyPrompt()}
  </button>
{/if}
