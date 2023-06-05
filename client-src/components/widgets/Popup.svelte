<script lang="ts">
  import { onDestroy } from "svelte";
  import { getScreenPosition, hasChild } from "@/libs/util/dom";
  import { isDarkMode } from "@/libs/util/webui";

  export let parent: HTMLElement;
  export let show: boolean;

  let ref: Nullable<HTMLElement> = null;
  let left = 0;
  let top = 0;

  const move = () => {
    if (ref == null) return;
    const { parentElement } = ref;
    if (parentElement && parentElement !== document.body) {
      parentElement.removeChild(ref);
      document.body.appendChild(ref);
    }
  };

  const update = () => {
    if (ref == null) return;
    const { left: parentLeft, bottom: parentBottom } = getScreenPosition(parent);
    const maxWidth = document.body.clientWidth;
    const width = ref.clientWidth;
    left = parentLeft + width > maxWidth ? maxWidth - width - 4 : parentLeft;
    top = parentBottom + 4;
  };

  const onMouseDown = (event: MouseEvent) => {
    if (ref == null) return;
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;
    if (event.button !== 1 && target !== ref && target !== parent && !hasChild(ref, target)) {
      show = false;
    }
  };

  $: if (ref != null) {
    move();
    update();
  }

  onDestroy(() => {
    if (ref != null) {
      document.body.removeChild(ref);
    }
  });
</script>

<svelte:window on:resize={update} />
<svelte:body on:mousedown={onMouseDown} />

{#if show}
  <div
    class="popup"
    class:dark={isDarkMode()}
    style:--left="{left}px"
    style:--top="{top}px"
    bind:this={ref}
  >
    <slot />
  </div>
{/if}

<style lang="postcss">
  .popup {
    @apply absolute left-[--left] top-[--top] z-[1000] rounded border border-solid border-[--block-border-color] p-[--input-padding] text-[length:--body-text-size] font-[--body-text-weight] text-[--body-text-color] shadow-sm shadow-black/50 [background:--body-background-fill];
  }
</style>
