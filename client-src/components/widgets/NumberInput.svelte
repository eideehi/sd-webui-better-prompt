<script lang="ts">
  import Big from "big.js";
  import { dispatchEvent } from "@/libs/util/webui";

  type Options = {
    min?: number;
    max?: number;
    input?: { step?: number };
    slider?: { step?: number };
  };

  export let label: Nullable<string> = null;
  export let value = 0;
  export let options: Options = {};

  let { min, max, input, slider } = Object.assign({ input: {}, slider: {} } as Options, options);

  let sliderRef: Nullable<HTMLInputElement> = null;
  function onWheel(event: WheelEvent): void {
    if (sliderRef == null) return;

    const direction = event.deltaY < 0 ? "up" : "down";
    if (direction === "up" && max != null && value >= max) return;
    if (direction === "down" && min != null && value <= min) return;
    event.preventDefault();

    let val = new Big(value);
    const step = Number(slider?.step) || 1;
    if (direction === "up") {
      val = val.plus(step);
    } else {
      val = val.minus(step);
    }

    sliderRef.valueAsNumber = value = val.toNumber();
    dispatchEvent(sliderRef, "input");
  }
</script>

<div class="number-input" on:wheel={onWheel}>
  <div class="input-row">
    {#if label}
      <span class="label">{label}</span>
    {/if}
    <input
      bind:value
      class="input"
      {max}
      {min}
      on:change
      on:focusin
      on:focusout
      on:input
      on:keydown
      on:keyup
      step={input?.step}
      type="number"
    />
  </div>
  <div class="slider-row">
    <input
      bind:this={sliderRef}
      bind:value
      class="slider"
      {max}
      {min}
      on:input
      step={slider?.step}
      type="range"
    />
  </div>
</div>

<style lang="postcss">
  .number-input {
    @apply flex flex-col gap-2;
  }

  .input-row {
    @apply flex items-center justify-between;
  }

  .label {
    @apply mr-8;
  }

  .input {
    @apply h-[--size-6] w-[6rem] rounded-[--input-radius] border-[length:--input-border-width] border-solid border-[--input-border-color] p-[--input-padding] px-[--size-2] py-0 text-center text-[length:--input-text-size] leading-[--line-sm] text-[--body-text-color] outline-none [box-shadow:--input-shadow] [background:--input-background-fill];
  }

  .input:focus {
    @apply border-[--input-border-color-focus] [box-shadow:--input-shadow-focus];
  }

  .slider {
    @apply m-0 w-full p-0 [accent-color:--slider-color];
  }
</style>
