<script lang="ts">
  import type { SuggestData } from "./_logic/suggest";
  import ExtraNetworksItem from "./ExtraNetworksItem.svelte";
  import DanbooruItem from "./DanbooruItem.svelte";

  export let data: SuggestData;
  export let index: number;
</script>

{#if data.type === "extra-networks"}
  <ExtraNetworksItem {index} data={data.value} />
{:else if data.type === "danbooru"}
  <DanbooruItem {index} data={data.value} />
{/if}
