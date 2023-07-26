import { Message } from "./message";

const AddNewMyPrompt = Message("better-prompt.add-new-my-prompt", "Add new My Prompt");
const AddThisMyPrompt = Message("better-prompt.add-this-my-prompt", "Add this My Prompt");
const CancelAddingMyPrompt = Message(
  "better-prompt.cancel-adding-my-prompt",
  "Cancel adding My Prompt"
);
const CancelMyPromptDeletion = Message(
  "better-prompt.cancel-my-prompt-deletion",
  "Cancel My Prompt deletion"
);
const DeleteSelectedMyPrompt = Message(
  "better-prompt.delete-selected-my-prompt",
  "Delete selected My Prompts"
);
const EditorNegativePrompt = Message("better-prompt.editor-negative-prompt", "Negative prompt");
const EditorPrompt = Message("better-prompt.editor-prompt", "Prompt");
const EmptyMyPrompt = Message(
  "better-prompt.empty-my-prompts",
  'You don\'t have any My Prompt yet. Press the "Add My Prompt" button to add your My Prompt.'
);
const InputPrompt = Message("better-prompt.input-prompt", "Input prompt...");
const LoraNegativePromptError = Message(
  "better-prompt.lora-negative-prompt-error",
  "LoRA cannot be add to negative prompt"
);
const MyPrompt = Message("better-prompt.my-prompt", "My Prompt");
const MyPromptLabel = Message("better-prompt.my-prompt-label", "Label");
const MyPromptPrompt = Message("better-prompt.my-prompt-prompt", "Prompt");
const MyPromptTags = Message("better-prompt.my-prompt-tags", "Tags");
const MyPromptTagsEmpty = Message("better-prompt.my-prompt-tags-empty", "No tags are set");
const PagenationEllipsis = Message("better-prompt.pagenation-ellipsis", "…");
const PagenationNext = Message("better-prompt.pagenation-next", "Next");
const PagenationPrevious = Message("better-prompt.pagenation-previous", "Previous");
const PromptEdit = Message("better-prompt.prompt-edit", "Prompt Edit");
const SearchMyPrompts = Message("better-prompt.search-my-prompts", "Search my prompts...");
const SelectAndDeleteMyPrompt = Message(
  "better-prompt.select-and-delete-my-prompt",
  "Select and delete My Prompt"
);
const SuggestFilterAll = Message("better-prompt.suggest-filter-all", "All");
const SuggestFilterDanbooruCharacter = Message(
  "better-prompt.suggest-filter-danbooru-character",
  "Danbooru Tag (Character)"
);
const SuggestFilterDanbooruCopyright = Message(
  "better-prompt.suggest-filter-danbooru-copyright",
  "Danbooru Tag (Copyright)"
);
const SuggestFilterDanbooruGeneral = Message(
  "better-prompt.suggest-filter-danbooru-general",
  "Danbooru Tag (General)"
);
const SuggestFilterLora = Message("better-prompt.suggest-filter-lora", "LoRA");
const SuggestFilterMyPrompt = Message("better-prompt.suggest-filter-my-prompt", "My Prompt");
const SuggestFilterTextualInversion = Message(
  "better-prompt.suggest-filter-textual-inversion",
  "Textual Inversion"
);
const Weight = Message("better-prompt.weight", "Weight");

export {
  AddNewMyPrompt,
  AddThisMyPrompt,
  CancelAddingMyPrompt,
  CancelMyPromptDeletion,
  DeleteSelectedMyPrompt,
  EditorNegativePrompt,
  EditorPrompt,
  EmptyMyPrompt,
  InputPrompt,
  LoraNegativePromptError,
  MyPrompt,
  MyPromptLabel,
  MyPromptPrompt,
  MyPromptTags,
  MyPromptTagsEmpty,
  PagenationEllipsis,
  PagenationNext,
  PagenationPrevious,
  PromptEdit,
  SearchMyPrompts,
  SelectAndDeleteMyPrompt,
  SuggestFilterAll,
  SuggestFilterDanbooruCharacter,
  SuggestFilterDanbooruCopyright,
  SuggestFilterDanbooruGeneral,
  SuggestFilterLora,
  SuggestFilterMyPrompt,
  SuggestFilterTextualInversion,
  Weight,
};
