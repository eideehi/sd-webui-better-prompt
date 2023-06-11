<script lang="ts">
  import type { Prompt } from "@/libs/prompt";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { createLoraReadable, createTextualInversionReadable } from "./_logic/betterPrompt";
  import { type BetterPromptContext, betterPromptContextKey } from "./_logic/context";
  import Editor from "./editor/Editor.svelte";
  import Input from "./input/Input.svelte";

  export let tabName: ExtensionAvailableTab;

  const positive = writable<Prompt[]>([]);
  const negative = writable<Prompt[]>([]);

  setContext<BetterPromptContext>(betterPromptContextKey, {
    tabName,
    prompts: { positive, negative },
    extraNetworksData: {
      lora: createLoraReadable(tabName),
      textualInversion: createTextualInversionReadable(tabName),
    },
  });
</script>

<div class="better-prompt" id="{tabName}-better-prompt">
  <div class="editor-container">
    <Editor />
    <Editor negative={true} />
  </div>
  <div class="input-container">
    <Input />
  </div>
</div>

<style lang="postcss">
  .better-prompt {
    @apply flex w-full flex-wrap gap-[--layout-gap];
  }

  .editor-container {
    @apply flex min-w-[min(640px,100%)] grow-[6] basis-0 flex-col gap-[--layout-gap];
  }

  .input-container {
    @apply flex w-min min-w-[min(640px,100%)] grow;
  }
</style>
