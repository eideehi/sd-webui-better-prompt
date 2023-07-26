<script lang="ts">
  import { getContext } from "svelte";
  import { parsePrompt } from "#/prompt";
  import { type BetterPromptContext, betterPromptContextKey } from "@/_logic/context";
  import { adjustPrompt } from "@/_logic/adjustPrompt";
  import { textualInversion } from "@/_logic/extraNetworks";
  import * as t from "~/messages";
  import {
    type PromptInputContext,
    type PseudoFocusMoveDirection,
    promptInputContextKey,
  } from "./_logic/context";
  import TextInput from "%/TextInput.svelte";

  export let promptText: string;

  const {
    prompts: { positive, negative },
  } = getContext<BetterPromptContext>(betterPromptContextKey);
  const { pseudoFocus, movePseudoFocus, currentFocus } =
    getContext<PromptInputContext>(promptInputContextKey);

  function setSelection({ target }: FocusEvent): void {
    if (!(target instanceof HTMLInputElement)) return;
    target.selectionStart = 0;
    target.selectionEnd = target.value.length;
  }

  function clearPseudoFocus(): void {
    pseudoFocus.set(-1);
    currentFocus.set(null);
  }

  function confirmPrompt(event: KeyboardEvent): void {
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) return;
    const focus = $currentFocus;
    if (focus == null) {
      parsePrompt(target.value, (prompts) => {
        prompts = prompts.map((prompt) => adjustPrompt(prompt, $textualInversion));
        if (event.shiftKey) {
          negative.update((current) => current.concat(prompts));
        } else {
          positive.update((current) => current.concat(prompts));
        }
      });
    } else {
      focus.dispatchEvent(new MouseEvent("click", { button: 0, shiftKey: event.shiftKey }));
    }
    promptText = "";
  }

  function onKeyDown(event: KeyboardEvent): void {
    const prevent = () => {
      event.preventDefault();
      event.stopPropagation();
    };
    const move = (direction: PseudoFocusMoveDirection) => {
      if ($pseudoFocus === -1) return;
      prevent();
      movePseudoFocus.set(direction);
    };
    switch (event.key) {
      case "Enter":
        prevent();
        confirmPrompt(event);
        clearPseudoFocus();
        break;
      case "Escape":
        prevent();
        clearPseudoFocus();
        break;
      case "Tab":
        prevent();
        movePseudoFocus.set(event.shiftKey ? "previous" : "next");
        break;
      case "ArrowDown":
        move("down");
        break;
      case "ArrowUp":
        move("up");
        break;
      case "ArrowRight":
        move("right");
        break;
      case "ArrowLeft":
        move("left");
        break;
    }
  }
</script>

<TextInput
  bind:value={promptText}
  on:focusin={setSelection}
  on:focusout={clearPseudoFocus}
  on:input={clearPseudoFocus}
  on:keydown={onKeyDown}
  options={{ placeholder: t.InputPrompt() }}
/>
