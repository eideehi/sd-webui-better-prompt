<script context="module" lang="ts">
  import type { ToastMessage } from "#/widgets/Toast.svelte";
  import { writable } from "svelte/store";

  const messages = writable<ToastMessage[]>([]);

  export function showToast(message: ToastMessage): void {
    messages.update((values) => {
      if (values.some((_message) => _message.text === message.text)) return values;
      return [...values, Object.assign({ type: "info", duration: 3000 }, message)];
    });
  }

  export function closeToast(message: ToastMessage): void {
    messages.update((value) => value.filter((_message) => _message !== message));
  }
</script>

<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { isDarkMode } from "@/libs/util/webui";

  function setCloseTimer(message: ToastMessage): void {
    if ((message?.duration || 0) <= 0) return;
    window.setTimeout(() => closeToast(message), message.duration);
  }
</script>

<div class="toast-area" id="better-prompt-toast">
  {#each $messages as message}
    <button
      class="message {message.type}"
      class:dark={isDarkMode()}
      in:fly={{ y: 128, duration: 250 }}
      out:fade
      on:introend={() => setCloseTimer(message)}
      on:click={() => closeToast(message)}
    >
      {message.text}
    </button>
  {/each}
</div>

<style lang="postcss">
  .toast-area {
    @apply fixed inset-x-0 bottom-4 z-[1000] m-auto flex w-fit flex-col gap-y-2;
  }

  .message {
    @apply cursor-pointer rounded border-none px-4 py-2 text-xl font-bold text-white;
  }

  .message.info {
    @apply bg-[#323bfa];
  }

  .message.success {
    @apply bg-[#1ced41];
  }

  .message.warning {
    @apply bg-[#f97316];
  }

  .message.error {
    @apply bg-[#e44939];
  }
</style>
