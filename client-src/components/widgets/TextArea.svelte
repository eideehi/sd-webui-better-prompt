<script lang="ts">
  export let label: Nullable<string> = null;
  export let value = "";
  export let options: Nullable<{ placeholder?: string }> = null;

  let { placeholder } = Object.assign({ placeholder: "" }, options || {});
</script>

<div class="text-area">
  {#if label}
    <span class="label">{label}</span>
  {/if}
  <textarea
    bind:value
    class="input"
    rows="3"
    on:change
    on:focusin
    on:focusout
    on:input
    on:keydown
    on:keyup
    {placeholder}
  />
</div>

<style lang="postcss">
  .text-area {
    @apply flex flex-col;
  }

  .input {
    @apply h-[86px] grow overflow-y-scroll rounded-[--input-radius] border-[length:--input-border-width] border-solid border-[--input-border-color] p-[--input-padding] text-[length:--input-text-size] leading-[--line-sm] text-[--body-text-color] outline-none [background:--input-background-fill] [box-shadow:--input-shadow] [-ms-overflow-style:none] [scrollbar-width:none];
  }

  .input::-webkit-scrollbar {
    @apply hidden;
  }

  .input:focus {
    @apply border-[--input-border-color-focus] [box-shadow:--input-shadow-focus];
  }
</style>
