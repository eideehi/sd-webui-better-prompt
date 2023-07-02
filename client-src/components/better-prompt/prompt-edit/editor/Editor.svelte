<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { isEquals, parsePrompt, toString } from "@/libs/prompt";
  import { getElement } from "@/libs/util/dom";
  import { t, dispatchEvent } from "@/libs/util/webui";
  import { type BetterPromptContext, betterPromptContextKey } from "#/better-prompt/_logic/context";
  import { adjustPrompt } from "#/better-prompt/_logic/adjustPrompt";
  import { type EditorContext, editorContextKey } from "./_logic/context";
  import TokenCounter from "./TokenCounter.svelte";
  import PromptList from "./prompt-list/PromptList.svelte";

  export let negative = false;

  const {
    tabName,
    prompts: { positive: positivePrompts, negative: negativePrompts },
    extraNetworksData: { textualInversion },
  } = getContext<BetterPromptContext>(betterPromptContextKey);
  const prompts = negative ? negativePrompts : positivePrompts;

  setContext<EditorContext>(editorContextKey, { negative, prompts });

  let observeId = -1;
  let updateId = -1;
  let cachedPrompt = "";
  let skipUpdate = false;

  const selector = negative ? `#${tabName}_neg_prompt textarea` : `#${tabName}_prompt textarea`;

  const update = () => {
    const textarea = getElement(selector);
    if (!(textarea instanceof HTMLTextAreaElement)) {
      updateId = -1;
      return;
    }

    const prompt = textarea.value.trim();
    if (prompt === cachedPrompt) {
      updateId = -1;
      return;
    }
    cachedPrompt = prompt;

    parsePrompt(prompt, (_prompts) => {
      _prompts = _prompts.map((prompt) => adjustPrompt(prompt, $textualInversion));
      if (isEquals($prompts, _prompts)) return;

      skipUpdate = true;
      prompts.set(_prompts);
      skipUpdate = false;
    });
    updateId = -1;
  };

  const triggerUpdate = () => {
    if (updateId !== -1) {
      clearTimeout(updateId);
    }
    updateId = window.setTimeout(update, 750);
  };

  const observe = () => {
    if (updateId === -1) {
      update();
    }
    observeId = window.setTimeout(observe, 1000);
  };

  prompts.subscribe((value) => {
    if (skipUpdate) return;

    const textarea = getElement(selector);
    if (!(textarea instanceof HTMLTextAreaElement)) return;

    textarea.value = cachedPrompt = toString(value);
    dispatchEvent(textarea, "input");
  });

  onMount(() => {
    observeId = window.setTimeout(observe, 0);

    const textarea = getElement(selector);
    if (textarea instanceof HTMLTextAreaElement) {
      textarea.addEventListener("input", triggerUpdate);
    }

    return () => {
      clearTimeout(observeId);
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.removeEventListener("input", triggerUpdate);
      }
    };
  });
</script>

<div class="editor">
  <span>{t(negative ? "Negative prompt" : "Prompt")}</span>
  <div class="content">
    <TokenCounter />
    <PromptList />
  </div>
</div>

<style lang="postcss">
  .editor {
    @apply flex flex-col;
  }

  .content {
    @apply relative;
  }
</style>
