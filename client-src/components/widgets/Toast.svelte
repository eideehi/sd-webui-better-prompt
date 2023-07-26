<script lang="ts" context="module">
  export type ToastType = "info" | "success" | "warning" | "error";

  export type ToastMessage = {
    type?: ToastType;
    text: string;
    duration?: number;
  };

  export function showToast(message: ToastMessage): void {
    const element = document.querySelector("#eidee-net-toast-messages");
    if (element == null) return;

    const data = document.createElement("span");
    data.dataset.type = message.type || "info";
    data.dataset.text = message.text;
    data.dataset.duration = (message.duration || 5000).toString();

    element.appendChild(data);
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  let messages: ToastMessage[] = [];

  const closeToast = (message: ToastMessage) => {
    messages = messages.filter((value) => value.text !== message.text);
  };

  const setCloseTimer = (message: ToastMessage) => {
    window.setTimeout(() => closeToast(message), message.duration || 5000);
  };

  function parseToastMessage(node: Node): Nullable<ToastMessage> {
    if (!(node instanceof HTMLElement)) return null;
    const { type, text, duration } = node.dataset;
    if (text == null || messages.some((message) => message.text === text)) return null;
    if (type == null || !["info", "success", "warning", "error"].includes(type)) return null;
    if (duration == null || isNaN(Number(duration))) return null;
    return { type: type as ToastType, text, duration: Number(duration) };
  }

  let messagesRef: HTMLElement;
  onMount(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          const message = parseToastMessage(node);
          if (message != null) {
            messages.push(message);
          }
          node.parentNode?.removeChild(node);
        });
      });
      messages = [...messages];
    });
    observer.observe(messagesRef, { childList: true });
    return () => observer.disconnect();
  });
</script>

<div id="eidee-net-toast-container">
  {#each messages as message (message.text)}
    <button
      class="message {message.type}"
      in:fly={{ y: 128, duration: 250 }}
      out:fade
      on:introend={() => setCloseTimer(message)}
      on:click={() => closeToast(message)}
    >
      {message.text}
    </button>
  {/each}
</div>

<div id="eidee-net-toast-messages" bind:this={messagesRef} />

<style lang="postcss">
  #eidee-net-toast-container {
    @apply fixed inset-x-0 bottom-4 z-[1000] m-auto box-border flex w-fit flex-col gap-y-2 [font-family:--font];
  }

  .message {
    @apply cursor-pointer rounded-[--button-large-radius] border-none p-[--button-large-padding] text-[length:--text-xl] font-[--button-large-text-weight] text-white;
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

  #eidee-net-toast-messages {
    @apply hidden;
  }
</style>
