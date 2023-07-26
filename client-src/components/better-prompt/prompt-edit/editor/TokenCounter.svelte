<script lang="ts">
  import { getContext } from "svelte";
  import { readable } from "svelte/store";
  import { getElement, hasElement } from "#/util/dom";
  import { type BetterPromptContext, betterPromptContextKey } from "@/_logic/context";
  import { type EditorContext, editorContextKey } from "./_logic/context";

  let error = false;

  const { tabName } = getContext<BetterPromptContext>(betterPromptContextKey);
  const { negative } = getContext<EditorContext>(editorContextKey);

  const tokenCounterId = `${tabName}${negative ? "_negative" : ""}_token_counter`;
  const errorSelector = `#${tokenCounterId}.error`;
  const countSelector = `#${tokenCounterId} > span`;

  const tokenCount = readable("0/75", (set) => {
    let current = "0/75";
    const interval = setInterval(() => {
      const element = getElement(countSelector);
      if (element == null) return;
      error = hasElement(errorSelector);
      const count = element.textContent || "0/75";
      if (count === current) return;
      current = count;
      set(count);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="token-counter block" class:error>
  <span class="value">{$tokenCount}</span>
</div>
