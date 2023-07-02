<script lang="ts">
  import { onDestroy } from "svelte";
  import { scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { isDarkMode } from "@/libs/util/webui";

  export let title: string;
  export let show: boolean;

  let ref: Nullable<HTMLElement> = null;
  let left = 0;
  let top = 0;

  let dragging = false;
  let leftOrigin = -1;
  let topOrigin = -1;
  let draggingStartX = -1;
  let draggingStartY = -1;

  const init = () => {
    if (ref == null) return;
    const { parentElement } = ref;
    if (parentElement && parentElement !== document.body) {
      left = (window.innerWidth - ref.clientWidth) / 2 + window.scrollX;
      top = (window.innerHeight - ref.clientHeight) / 2 + window.scrollY;
      parentElement.removeChild(ref);
      document.body.appendChild(ref);
    }
  };

  const onMouseDown = (event: MouseEvent) => {
    if (ref == null) return;
    if (event.button !== 0) return;

    dragging = true;
    leftOrigin = left;
    topOrigin = top;
    draggingStartX = event.clientX;
    draggingStartY = event.clientY;
  };

  const onMouseMove = (event: MouseEvent) => {
    if (ref == null) return;
    if (!dragging) return;

    left = Math.min(
      Math.max(leftOrigin + (event.clientX - draggingStartX), 0),
      document.documentElement.scrollWidth - ref.clientWidth - 2
    );
    top = Math.min(
      Math.max(topOrigin + (event.clientY - draggingStartY), 0),
      document.documentElement.scrollHeight - ref.clientHeight - 2
    );
  };

  const onMouseUp = () => {
    if (ref == null) return;
    dragging = false;
  };

  $: if (ref != null) {
    init();
  }

  onDestroy(() => {
    if (ref != null) {
      document.body.removeChild(ref);
    }
  });
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

{#if show}
  <div
    class="better-prompt popup-window"
    class:dark={isDarkMode()}
    style:--left="{left}px"
    style:--top="{top}px"
    bind:this={ref}
    transition:scale={{ duration: 250, opacity: 0, start: 0.25, easing: quintOut }}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="title-bar" on:mousedown={onMouseDown}>
      <span class="title">{title}</span>
      <button class="close-button" on:mousedown|stopPropagation on:click={() => (show = false)}>
        ×
      </button>
    </div>
    <div>
      <slot />
    </div>
  </div>
{/if}

<style lang="postcss">
  .popup-window {
    @apply absolute left-[--left] top-[--top] z-[1000] rounded border border-solid border-[--block-border-color] text-[length:--body-text-size] font-[--body-text-weight] text-[--body-text-color] shadow-md shadow-black/50 [background:--body-background-fill];
  }

  .title-bar {
    @apply flex select-none items-center justify-between;
  }

  .title {
    @apply ml-3 opacity-75;
  }

  .close-button {
    @apply w-8 cursor-pointer border-none text-[--body-text-color] [background:none] [font-size:2rem] [line-height:1];
  }
</style>
