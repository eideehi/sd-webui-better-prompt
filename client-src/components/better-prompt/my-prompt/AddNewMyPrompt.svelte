<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import { createEventDispatcher } from "svelte";
  import { addMyPrompt, allMyPromptTags, myPrompts } from "#/better-prompt/_logic/myPrompts";
  import {
    addNewMyPrompt,
    addThisMyPrompt,
    myPromptLabel,
    myPromptPrompt,
    myPromptTags,
  } from "#/better-prompt/_logic/messages";
  import TextInput from "#/widgets/TextInput.svelte";
  import PopupWindow from "#/widgets/PopupWindow.svelte";
  import MultiInput from "#/widgets/MultiInput.svelte";
  import TextArea from "#/widgets/TextArea.svelte";

  let showPopup = false;
  let myPrompt: MyPrompt = {
    label: "",
    tags: [],
    prompt: "",
  };

  const dispatch = createEventDispatcher();

  $: {
    if (showPopup) {
      dispatch("popupopen");
    } else {
      myPrompt = {
        label: "",
        tags: [],
        prompt: "",
      };
    }
  }

  export function closePopup(): void {
    showPopup = false;
  }

  function isValid({ label, prompt }: MyPrompt): boolean {
    if (!label || $myPrompts.find((myPrompt) => myPrompt.label === label) != null) return false;
    return prompt.length > 0;
  }

  function onClickConfirm(): void {
    if (!isValid(myPrompt)) return;

    addMyPrompt(myPrompt);

    showPopup = false;
  }
</script>

<button class="button secondary lg" on:click={() => (showPopup = true)}>
  {addNewMyPrompt.translate()}
</button>

<PopupWindow title={addNewMyPrompt.translate()} bind:show={showPopup}>
  <div class="add-new-my-prompt">
    <TextInput label={myPromptLabel.translate()} bind:value={myPrompt.label} />
    <MultiInput
      label={myPromptTags.translate()}
      bind:values={myPrompt.tags}
      list={$allMyPromptTags}
    />
    <TextArea label={myPromptPrompt.translate()} bind:value={myPrompt.prompt} />
    <button class="button primary lg" on:click={onClickConfirm} disabled={!isValid(myPrompt)}>
      {addThisMyPrompt.translate()}
    </button>
  </div>
</PopupWindow>

<style lang="postcss">
  .add-new-my-prompt {
    @apply flex w-[256px] flex-col gap-[--layout-gap] px-3 pb-2 sm:w-[384px] lg:w-[512px];
  }
</style>
