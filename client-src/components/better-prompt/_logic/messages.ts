import { t } from "@/libs/util/webui";

export interface Message {
  translate(args?: Array<string | number | boolean>): string;
}

class MessageImpl implements Message {
  private readonly key: string;
  private readonly defaultValue: string;

  constructor(key: string, defaultValue: string) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  translate(args?: Array<string | number | boolean>): string {
    return t(this.key, { defaultValue: this.defaultValue, args });
  }
}

const addNewMyPrompt = new MessageImpl("add-new-my-prompt", "Add new My Prompt");
const addThisMyPrompt = new MessageImpl("add-this-my-prompt", "Add this My Prompt");
const cancelMyPromptDeletion = new MessageImpl(
  "cancel-my-prompt-deletion",
  "Cancel My Prompt deletion"
);
const deleteSelectedMyPrompt = new MessageImpl(
  "delete-selected-my-prompt",
  "Delete selected My Prompts"
);
const editorNegativePrompt = new MessageImpl("editor-negative-prompt", "Negative prompt");
const editorPrompt = new MessageImpl("editor-prompt", "Prompt");
const emptyMyPrompt = new MessageImpl(
  "empty-my-prompts",
  'You don\'t have any My Prompt yet. Press the "Add My Prompt" button to add your My Prompt.'
);
const inputPrompt = new MessageImpl("input-prompt", "Input prompt...");
const loraNegativePromptError = new MessageImpl(
  "lora-negative-prompt-error",
  "LoRA cannot be add to negative prompt"
);
const myPrompt = new MessageImpl("my-prompt", "My Prompt");
const myPromptLabel = new MessageImpl("my-prompt-label", "Label");
const myPromptPrompt = new MessageImpl("my-prompt-prompt", "Prompt");
const myPromptTags = new MessageImpl("my-prompt-tags", "Tags");
const myPromptTagsEmpty = new MessageImpl("my-prompt-tags-empty", "No tags are set");
const pagenationEllipsis = new MessageImpl("pagenation-ellipsis", "…");
const pagenationNext = new MessageImpl("pagenation-next", "Next");
const pagenationPrevious = new MessageImpl("pagenation-previous", "Previous");
const promptEdit = new MessageImpl("prompt-edit", "Prompt Edit");
const searchMyPrompts = new MessageImpl("search-my-prompts", "Search my prompts...");
const selectAndDeleteMyPrompt = new MessageImpl(
  "select-and-delete-my-prompt",
  "Select and delete My Prompt"
);
const suggestFilterAll = new MessageImpl("suggest-filter-all", "All");
const suggestFilterDanbooruCharacter = new MessageImpl(
  "suggest-filter-danbooru-character",
  "Danbooru Tag (Character)"
);
const suggestFilterDanbooruCopyright = new MessageImpl(
  "suggest-filter-danbooru-copyright",
  "Danbooru Tag (Copyright)"
);
const suggestFilterDanbooruGeneral = new MessageImpl(
  "suggest-filter-danbooru-general",
  "Danbooru Tag (General)"
);
const suggestFilterLora = new MessageImpl("suggest-filter-lora", "LoRA");
const suggestFilterMyPrompt = new MessageImpl("suggest-filter-my-prompt", "My Prompt");
const suggestFilterTextualInversion = new MessageImpl(
  "suggest-filter-textual-inversion",
  "Textual Inversion"
);
const weight = new MessageImpl("weight", "Weight");

export {
  addNewMyPrompt,
  addThisMyPrompt,
  cancelMyPromptDeletion,
  deleteSelectedMyPrompt,
  editorNegativePrompt,
  editorPrompt,
  emptyMyPrompt,
  inputPrompt,
  loraNegativePromptError,
  myPrompt,
  myPromptLabel,
  myPromptPrompt,
  myPromptTags,
  myPromptTagsEmpty,
  pagenationEllipsis,
  pagenationNext,
  pagenationPrevious,
  promptEdit,
  searchMyPrompts,
  selectAndDeleteMyPrompt,
  suggestFilterAll,
  suggestFilterDanbooruCharacter,
  suggestFilterDanbooruCopyright,
  suggestFilterDanbooruGeneral,
  suggestFilterLora,
  suggestFilterMyPrompt,
  suggestFilterTextualInversion,
  weight,
};
