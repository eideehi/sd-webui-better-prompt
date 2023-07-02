<script lang="ts">
  import type { MyPrompt } from "@/libs/my-prompt";
  import { createEventDispatcher } from "svelte";
  import { t } from "@/libs/util/webui";
  import { addMyPrompt, allMyPromptTags, myPrompts } from "#/better-prompt/_logic/myPrompts";
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

  function addNewMyPrompt(): void {
    if (!isValid(myPrompt)) return;

    addMyPrompt(myPrompt);

    showPopup = false;
  }
</script>

<button class="button secondary lg" on:click={() => (showPopup = true)}>
  {t("add-new-my-prompt", { defaultValue: "Add new My Prompt" })}
</button>

<PopupWindow
  title={t("add-new-my-prompt", { defaultValue: "Add new My Prompt" })}
  bind:show={showPopup}
>
  <div class="add-new-my-prompt">
    <TextInput
      label={t("my-prompt-label", { defaultValue: "Label" })}
      bind:value={myPrompt.label}
    />
    <MultiInput
      label={t("my-prompt-tags", { defaultValue: "Tags" })}
      bind:values={myPrompt.tags}
      list={$allMyPromptTags}
    />
    <TextArea
      label={t("my-prompt-prompt", { defaultValue: "Prompt" })}
      bind:value={myPrompt.prompt}
    />
    <button class="button primary lg" on:click={addNewMyPrompt} disabled={!isValid(myPrompt)}>
      {t("add-this.my-prompt", { defaultValue: "Add this My Prompt" })}
    </button>
  </div>
</PopupWindow>

<style lang="postcss">
  .add-new-my-prompt {
    @apply flex w-[256px] flex-col gap-[--layout-gap] px-3 pb-2 sm:w-[384px] lg:w-[512px];
  }
</style>
