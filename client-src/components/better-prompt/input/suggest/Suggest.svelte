<script lang="ts">
  import { type FilterType } from "./_logic/filters";
  import Filters from "./Filters.svelte";
  import List from "./List.svelte";

  export let promptText: string;

  let filters: FilterType[] = ["all"];
</script>

<Filters bind:filters />
<List {filters} {promptText} />
