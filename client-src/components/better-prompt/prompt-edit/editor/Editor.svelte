<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { isEquals, parsePrompt, toString } from "#/prompt";
  import { getElement } from "#/util/dom";
  import { dispatchEvent } from "#/util/webui";
  import { type BetterPromptContext, betterPromptContextKey } from "@/_logic/context";
  import { adjustPrompt } from "@/_logic/adjustPrompt";
  import { textualInversion } from "@/_logic/extraNetworks";
  import * as t from "~/messages";
  import { type EditorContext, editorContextKey } from "./_logic/context";
  import TokenCounter from "./TokenCounter.svelte";
  import PromptList from "./prompt-list/PromptList.svelte";

  export let negative = false;

  const caption = negative ? t.EditorNegativePrompt : t.EditorPrompt;

  const {
    tabName,
    prompts: { positive: positivePrompts, negative: negativePrompts },
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
  <span>{caption()}</span>
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
