<script lang="ts">
  import { type FilterType, FilterTypes, typeToLabel } from "./_logic/filters";
  import Checkbox from "#/widgets/Checkbox.svelte";
  import { toggleValue } from "@/libs/util/array";

  export let filters: FilterType[];

  function onFilterClick(type: FilterType): (event: InputEvent) => void {
    return ({ target }) => {
      if (!(target instanceof HTMLInputElement)) return;

      if (target.checked) {
        if (type === "all") {
          filters = ["all"];
        } else {
          filters = [...filters.filter((filter) => filter !== "all"), type];
        }
      } else {
        filters = toggleValue<FilterType>(filters, type);
      }
    };
  }
</script>

<ul class="suggest-filter">
  {#each FilterTypes as type}
    <li>
      <Checkbox
        label={typeToLabel(type)}
        on:change={onFilterClick(type)}
        value={filters.includes(type)}
      />
    </li>
  {/each}
</ul>

<style lang="postcss">
  .suggest-filter {
    @apply flex list-none flex-wrap gap-x-4 gap-y-2;
  }
</style>
