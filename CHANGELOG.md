## v0.4.1
### Add
- Added a cancel button to the registration dialog of "My Prompt".
### Fix
- Fixed an issue where the option values were not reflected in the new version of the Web UI.
### Remove
- Removed version change feature.
- Removed update notification feature.

## v0.4.0
### Add
- Added "My Prompt" feature, which was originally developed as "Aliases". Refer to the [My Prompt Tab](https://github.com/eideehi/sd-webui-better-prompt#my-prompt-tab) section in the README for details.
### Change
- Changed the format of the translation file.
### Fix
- When setting the default weight for LoRA, it now references the Web UI configuration. **([#13])**
- Fixed the issue where the prompt input area didn't maximize its width when wrapped.

## v0.3.0
### Update
- Updated Danbooru tags.
### Change
- (For developers) Introduced the Svelte framework.
- Changed the word "Multiplier" to "Weight".
- Enabled mouse wheel control for the Weight slider.
- Improved prompt parsing performance. **([#12])**
### Fix
- Improved synchronization with the original prompt area. **([#8])**
### Remove
- Temporarily removed the Undo Redo feature.

## v0.2.0
### Add
- Added a button to display metadata in thumbnail preview for Textual Inversion and LoRA.
- Added undo/redo functionality to the prompt.
### Fix
- Fixed an issue where list elements would flicker when updating the prompt.
- Fixed bugs related to Git.

## v0.1.0
This is the initial release of Better Prompt.

<!-- Issue links -->
[#8]: https://github.com/eideehi/sd-webui-better-prompt/issues/8
[#12]: https://github.com/eideehi/sd-webui-better-prompt/issues/12
[#13]: https://github.com/eideehi/sd-webui-better-prompt/issues/13
