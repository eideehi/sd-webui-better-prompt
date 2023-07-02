<script lang="ts">
  import { t } from "@/libs/util/webui";

  export let page: number;
  export let totalCount: number;
  export let displayLimit: number;

  let lastPage: number;
  $: lastPage = Math.ceil(totalCount / displayLimit);

  let pages: number[];
  $: {
    pages = [];
    for (let i = page - 2; i <= page + 2; i++) {
      if (i <= 0 || i > lastPage) continue;
      pages.push(i);
    }
  }
</script>

{#if totalCount > 0}
  <div class="pagenation">
    {#if page > 1}
      <button class="button secondary" on:click={() => (page = page - 1)}>
        {t("pagenation-previous", { defaultValue: "Previous" })}
      </button>
    {/if}
    {#if page >= 4}
      <button class="button secondary" on:click={() => (page = 1)}>1</button>
      {#if page >= 5}
        <span class="ellipsis">
          {t("pagenation-ellipsis", { defaultValue: "…" })}
        </span>
      {/if}
    {/if}
    {#each pages as _page}
      <button
        class="button secondary"
        class:active={_page === page}
        on:click={() => (page = _page)}
      >
        {_page}
      </button>
    {/each}
    {#if page < lastPage}
      <button class="button secondary" on:click={() => (page = page + 1)}>
        {t("pagenation-next", { defaultValue: "Next" })}
      </button>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .pagenation {
    @apply flex select-none flex-wrap gap-2;
  }

  .button {
    @apply rounded-sm px-[calc(var(--spacing-md)_*_2)] py-[--spacing-md] text-[length:--text-md] font-[--button-large-text-weight];
  }

  .button.active {
    @apply cursor-default ![background:linear-gradient(to_bottom_right,var(--neutral-900),var(--neutral-950))];
  }

  .ellipsis {
    @apply px-[calc(var(--spacing-md)_*_2)] py-[--spacing-md] text-[length:--text-md] font-[--button-large-text-weight];
  }
</style>
