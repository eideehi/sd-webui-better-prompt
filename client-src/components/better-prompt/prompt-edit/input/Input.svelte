<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { type PromptInputContext, promptInputContextKey } from "./_logic/context";
  import PromptInput from "./PromptInput.svelte";
  import Suggest from "./suggest/Suggest.svelte";

  let promptText = "";

  setContext<PromptInputContext>(promptInputContextKey, {
    pseudoFocus: writable(-1),
    currentFocus: writable(null),
    movePseudoFocus: writable(null),
  });
</script>

<div class="input">
  <PromptInput bind:promptText />
  <Suggest {promptText} />
</div>

<style lang="postcss">
  .input {
    @apply flex flex-grow flex-col gap-2;
  }
</style>
