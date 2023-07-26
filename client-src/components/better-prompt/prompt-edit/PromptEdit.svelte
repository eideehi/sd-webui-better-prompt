<script lang="ts">
  import Editor from "@/prompt-edit/editor/Editor.svelte";
  import Input from "@/prompt-edit/input/Input.svelte";

  export let active: boolean;
</script>

<div class="prompt-edit" class:active>
  <div class="editor-container">
    <Editor />
    <Editor negative={true} />
  </div>
  <div class="input-container">
    <Input />
  </div>
</div>

<style lang="postcss">
  .prompt-edit {
    @apply hidden w-full flex-wrap gap-[--layout-gap];
  }

  .prompt-edit.active {
    @apply flex;
  }

  .editor-container {
    @apply flex min-w-[min(640px,100%)] grow-[6] basis-0 flex-col gap-[--layout-gap];
  }

  .input-container {
    @apply flex w-min min-w-[min(640px,100%)] grow;
  }
</style>
