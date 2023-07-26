<script lang="ts">
  import type { MyPrompt } from "#/my-prompt";
  import { createEventDispatcher } from "svelte";
  import { addMyPrompt, allMyPromptTags, myPrompts } from "@/_logic/myPrompts";
  import * as t from "~/messages";
  import TextInput from "%/TextInput.svelte";
  import PopupWindow from "%/PopupWindow.svelte";
  import MultiInput from "%/MultiInput.svelte";
  import TextArea from "%/TextArea.svelte";

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
  {t.AddNewMyPrompt()}
</button>

<PopupWindow title={t.AddNewMyPrompt()} bind:show={showPopup}>
  <div class="add-new-my-prompt">
    <TextInput label={t.MyPromptLabel()} bind:value={myPrompt.label} />
    <MultiInput label={t.MyPromptTags()} bind:values={myPrompt.tags} list={$allMyPromptTags} />
    <TextArea label={t.MyPromptPrompt()} bind:value={myPrompt.prompt} />
    <div class="buttons">
      <button class="button primary lg" on:click={onClickConfirm} disabled={!isValid(myPrompt)}>
        {t.AddThisMyPrompt()}
      </button>
      <button class="button secondary lg" on:click={closePopup}>
        {t.CancelAddingMyPrompt()}
      </button>
    </div>
  </div>
</PopupWindow>

<style lang="postcss">
  .add-new-my-prompt {
    @apply flex w-[256px] flex-col gap-[--layout-gap] px-3 pb-2 sm:w-[384px] md:w-[512px] lg:w-[640px];
  }

  .buttons {
    @apply flex gap-3;
  }

  .buttons > .button {
    @apply grow basis-0;
  }
</style>
