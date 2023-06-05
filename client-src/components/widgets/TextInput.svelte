<script lang="ts">
  export let label: Nullable<string> = null;
  export let value = "";
  export let options: Nullable<{ placeholder?: string }> = null;

  let { placeholder } = Object.assign({ placeholder: "" }, options || {});
</script>

<div class="text-input">
  {#if label}
    <span class="label">{label}</span>
  {/if}
  <input
    bind:value
    class="input"
    on:change
    on:focusin
    on:focusout
    on:input
    on:keydown
    on:keyup
    {placeholder}
    type="text"
  />
</div>

<style lang="postcss">
  .text-input {
    @apply flex flex-col;
  }

  .text-input > .input {
    @apply w-full rounded-[--input-radius] border-[length:--input-border-width] border-solid border-[--input-border-color] p-[--input-padding] text-[length:--input-text-size] leading-[--line-sm] text-[--body-text-color] outline-none [box-shadow:--input-shadow] [background:--input-background-fill];
  }

  .text-input > .input:focus {
    @apply border-[--input-border-color-focus] [box-shadow:--input-shadow-focus];
  }
</style>
