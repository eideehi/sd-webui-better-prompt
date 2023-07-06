<script lang="ts">
  import type { Prompt } from "@/libs/prompt";
  import { weight as weightLabel } from "#/better-prompt/_logic/messages";
  import { getWeight, updateWeight } from "./_logic/weightInput";
  import NumberInput from "#/widgets/NumberInput.svelte";

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
    label={weightLabel.translate()}
    value={weight}
    options={{ min: -2, max: 2, input: { step: 0.01 }, slider: { step: 0.05 } }}
    on:input={onWeightUpdate}
  />
{/if}
