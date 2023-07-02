<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import { t } from "@/libs/util/webui";
  import { removeMyPrompts } from "#/better-prompt/_logic/myPrompts";

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
    {t("cancel-my-prompt-deletion", { defaultValue: "Cancel My Prompt deletion" })}
  {:else}
    {t("select-and-delete-my-prompt", {
      defaultValue: "Select and delete My Prompt",
    })}
  {/if}
</button>

{#if deleteMode}
  <button
    class="button primary lg"
    on:click={deleteMyPrompts}
    disabled={selectedMyPrompts.length === 0}
  >
    {t("delete-selected-my-prompt", { defaultValue: "Delete selected My Prompts" })}
  </button>
{/if}
