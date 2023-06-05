<script lang="ts">
  export let label = "";
  export let value = false;
</script>

<label class="checkbox">
  <input bind:checked={value} class="input" on:change type="checkbox" />
  <span class="label">{label}</span>
</label>

<style lang="postcss">
  .checkbox {
    @apply flex cursor-pointer select-none items-center text-[length:--checkbox-label-text-size] font-[--checkbox-label-text-weight] leading-[--line-md] text-[--body-text-color];
  }

  .checkbox > .input {
    @apply relative inline-block h-4 w-4 flex-shrink-0 select-none appearance-none rounded-[--checkbox-border-radius] border border-solid border-[--checkbox-border-color] bg-[--checkbox-background-color] bg-origin-border p-0 align-middle leading-[--line-sm] text-[#2563eb] [--ring-color:transparent] [box-shadow:--input-shadow];
  }

  .checkbox > .input:checked {
    @apply border-[--checkbox-border-color-selected] bg-[--checkbox-background-color-selected] bg-[url:--checkbox-check];
  }

  .checkbox > .input:not(:checked):hover {
    @apply border-[--checkbox-border-color-hover] bg-[--checkbox-background-color-hover];
  }

  .checkbox > .input:not(:checked):focus {
    @apply border-[--checkbox-border-color-focus] bg-[--checkbox-background-color-focus];
  }

  .checkbox > .label {
    @apply ml-[--size-2] flex cursor-pointer items-center whitespace-nowrap text-[length:--checkbox-label-text-size] font-[--checkbox-label-text-weight] leading-[--line-md] text-[--body-text-color];
  }
</style>
