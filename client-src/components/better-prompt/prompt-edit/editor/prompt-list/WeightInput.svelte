<script lang="ts">
  import type { Prompt } from "#/prompt";
  import * as t from "~/messages";
  import { getWeight, updateWeight } from "./_logic/weightInput";
  import NumberInput from "%/NumberInput.svelte";

  export let prompt: Prompt;

  let weight: number;
  $: weight = getWeight(prompt);

  function onWeightUpdate(event: InputEvent): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    prompt = updateWeight(prompt, event.target.valueAsNumber);
  }
</script>

{#if !isNaN(weight)}
  <NumberInput
    label={t.Weight()}
    value={weight}
    options={{ min: -2, max: 2, input: { step: 0.01 }, slider: { step: 0.05 } }}
    on:input={onWeightUpdate}
  />
{/if}
