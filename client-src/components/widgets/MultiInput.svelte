<script lang="ts">
  import { toggleValue } from "#/util/array";
  import Popup from "./Popup.svelte";
  import { getElement, hasChild, scrollIntoViewIfNeeded } from "#/util/dom";

  export let label: Nullable<string> = null;
  export let values: string[];
  export let list: string[] = [];
  export let options: { disabled?: boolean } = {};

  let { disabled } = Object.assign({ disabled: false }, options);

  let ref: Nullable<HTMLElement> = null;
  let popup: Nullable<HTMLElement> = null;

  let inputValue = "";
  let suggests: string[] = [];
  let showSuggests = false;
  let virtualFocus = -1;

  $: {
    if (virtualFocus >= suggests.length) {
      virtualFocus = suggests.length - 1;
    }
  }

  function isSelected(value: string, values: string[]): boolean {
    return values.includes(value);
  }

  function toggleSelect(value: string): () => void {
    return () => (values = toggleValue(values, value));
  }

  function removeValue(value: string): () => void {
    return () => (values = values.filter((_value) => _value !== value));
  }

  function suggestUpdate(): void {
    const input = inputValue.toLowerCase();
    suggests = list.filter((value) => value.toLowerCase().includes(input));
    showSuggests = suggests.length > 0;
  }

  function focusOnInput(): void {
    if (ref == null) return;

    const input = getElement(ref, ".input");
    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }

  function onFocusIn(): void {
    if (ref == null) return;
    if (showSuggests) return;
    if (!list) return;

    virtualFocus = -1;
    suggestUpdate();
  }

  function onFocusOut({ relatedTarget }: FocusEvent): void {
    if (popup != null && relatedTarget instanceof HTMLElement) {
      if (hasChild(popup, relatedTarget)) return;
    }
    showSuggests = false;
  }

  function onMouseDown(): void {
    if (ref == null) return;
    if (!list) return;

    showSuggests = !showSuggests;
    if (showSuggests) {
      suggestUpdate();
    }
  }

  function onInput(): void {
    if (ref == null) return;
    if (!showSuggests) return;
    if (!list) return;

    suggestUpdate();
  }

  function onKeyDown(event: KeyboardEvent): void {
    const { key, target } = event;

    if (virtualFocus < 0) {
      switch (key) {
        case "Enter":
          if (!(target instanceof HTMLInputElement)) return;
          if (!values.includes(target.value)) {
            values = [...values, target.value];
            target.value = "";
          }
          break;
        case "ArrowDown":
          if (!suggests) break;
          virtualFocus = 0;
          event.preventDefault();
          break;
        case "ArrowUp":
          if (!suggests) break;
          virtualFocus = suggests.length - 1;
          event.preventDefault();
          break;
      }
      return;
    }

    if (!suggests) return;

    switch (key) {
      case "Escape":
        virtualFocus = -1;
        event.preventDefault();
        break;
      case "Enter":
        values = toggleValue(values, suggests[virtualFocus]);
        break;
      case "ArrowDown":
        if (!suggests) break;
        if (++virtualFocus >= suggests.length) {
          virtualFocus = 0;
        }
        focusOnSelectedSuggestItem();
        event.preventDefault();
        break;
      case "ArrowUp":
        if (!suggests) break;
        if (--virtualFocus < 0) {
          virtualFocus = suggests.length - 1;
        }
        focusOnSelectedSuggestItem();
        event.preventDefault();
        break;
    }
  }

  const focusOnSelectedSuggestItem = () => {
    if (popup == null) return;
    if (virtualFocus < 0 && virtualFocus >= suggests.length) return;

    const item = getElement(popup, `.suggest-list > .suggest-item:nth-child(${virtualFocus + 1})`);
    if (item != null && item.parentElement != null) {
      scrollIntoViewIfNeeded(item, item.parentElement);
    }
  };
</script>

<div class="multi-input" bind:this={ref} on:focusin={onFocusIn} on:focusout={onFocusOut}>
  {#if label}
    <span class="label">{label}</span>
  {/if}
  <div class="content" class:disabled>
    {#each values as value}
      <button class="selected-value" on:click={removeValue(value)}>
        <span class="value">{value}</span>
        <span class="remove-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </span>
      </button>
    {/each}
    <input
      type="text"
      class="input"
      bind:value={inputValue}
      on:mousedown={onMouseDown}
      on:input={onInput}
      on:keydown={onKeyDown}
      {disabled}
    />
  </div>
</div>

{#if ref != null && !disabled}
  <Popup parent={ref} bind:show={showSuggests} options={{ closeOnClickOutside: false }}>
    <ul class="suggest-list" bind:this={popup} on:focusin={focusOnInput}>
      {#each suggests as suggest, i}
        <li class="suggest-item" class:focused={virtualFocus === i}>
          <button class="suggest" on:click={toggleSelect(suggest)}>
            <span class="check-icon" class:checked={isSelected(suggest, values)}>✓</span>
            <span>{suggest}</span>
          </button>
        </li>
      {/each}
    </ul>
  </Popup>
{/if}

<style lang="postcss">
  .content {
    @apply flex flex-wrap gap-2 rounded-[--input-radius] border-[length:--input-border-width] border-solid border-[--input-border-color] p-1.5 text-[length:--input-text-size] leading-[--line-sm] [background:--input-background-fill] [box-shadow:--input-shadow];
  }

  .content.disabled {
    @apply opacity-50;
  }

  .content::after {
    @apply block h-[calc(var(--text-md)_*_var(--line-md))] py-[calc(var(--spacing-md)_+_2px)] [content:""];
  }

  .selected-value {
    @apply flex cursor-pointer items-center rounded-[--button-small-radius] border-[length:--checkbox-label-border-width] border-solid border-[--checkbox-label-border-color] p-[--checkbox-label-padding] text-[length:--checkbox-label-text-size] font-[--checkbox-label-text-weight] leading-[--line-md] text-[--checkbox-label-text-color] [background:--checkbox-label-background-fill] [box-shadow:--checkbox-label-shadow];
  }

  .remove-icon {
    @apply ml-[--size-2] box-border flex h-[18px] w-[18px] items-center justify-center rounded-[--radius-full] border-[length:--checkbox-border-width] border-solid border-[--border-color-primary] fill-[--body-text-color] p-[--size-0-5] [background:--background-fill-primary];
  }

  .remove-icon > svg {
    @apply pointer-events-none;
  }

  .input {
    @apply w-32 grow px-1 text-[length:--input-text-size] leading-[--line-sm] text-[--body-text-color] outline-none [background:--input-background-fill] [border:none];
  }

  .suggest-list {
    @apply m-0 max-h-64 list-none overflow-y-auto p-0;
  }

  .suggest-item {
    --suggest-background: var(--neutral-100);
  }

  :global(.dark) .suggest-item {
    --suggest-background: var(--neutral-800);
  }

  .suggest-item.focused,
  .suggest-item:hover {
    @apply [background:--suggest-background];
  }

  .suggest {
    @apply flex w-full cursor-pointer items-center gap-x-1 pr-6 text-[length:--checkbox-label-text-size] font-[--checkbox-label-text-weight] leading-[--line-md] text-[--checkbox-label-text-color] [border:none] [background:none];
  }

  .check-icon {
    @apply invisible;
  }

  .check-icon.checked {
    @apply visible;
  }
</style>
