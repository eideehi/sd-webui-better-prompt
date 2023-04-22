English | [中文](README.zh-CN.md)| [日本語](README.ja.md)

Better Prompt is an extension of the [Stable Diffusion web
UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) that adds a
UI to assist with prompt input and editing.

<figure>
<img src="docs/images/overview.png" alt="Image - Overview" />
</figure>

# Overview

Better Prompt was created to reduce the various inconveniences of
traditional prompt input and editing. It allows you to set Textual
Inversion and LoRA without displaying Extra networks (🎴), rearrange the
order of prompts by drag and drop, and adjust the emphasis level of
prompts through a GUI.

# Installation

## Installing from the Browser (Recommended)

You can install it from the "Install from URL" option in the Extensions
tab. Simply enter
<https://github.com/zhongpei/sd-webui-better-prompt.git> in the "URL for
extension’s git repository" field and press the "Install" button.

<figure>
<img src="docs/images/install.png" alt="Image - Install" />
</figure>

## Installing using Git

You can also install it by executing the following command in the
directory where Stable Diffusion web UI is installed.

    git clone https://github.com/zhongpei/sd-webui-better-prompt.git extensions/sd-webui-better-prompt

## Better Prompt is not displayed or the display is broken

By installing it using the above methods, the latest version will be
installed. However, it may not work well with the version of Web UI you
are using. If Better Prompt is not displayed properly, it may be
possible to resolve the issue by using a different version.

You can change the version of Better Prompt from the Settings tab. For
more information, refer to [\[version\_change\]](#version_change).

# Usage

Better Prompt adds the part enclosed by the red line in the image below.
We will explain how to use this added content from now on.

<figure>
<img src="docs/images/components.png" alt="Image - Components" />
</figure>

## Prompt Addition Form <span id="input-form"></span>

Adding a prompt is done using the three elements shown in the following
image.

<figure>
<img src="docs/images/input-component.png"
alt="Image - Input Component" />
</figure>

### \[1\] Prompt Input Field <span id="input-field"></span>

Enter a prompt in this field and press the Enter key to add the content
to the positive prompt. Alternatively, press the Shift key while
pressing Enter to add the content to the negative prompt. If there are
Textual Inversion, LoRA, or Danbooru tags similar to the input content,
they will be displayed in a list in [\[suggest\]](#suggest).

Fuse.js is used for similarity determination, allowing various
determination methods such as "exact match," "prefix/suffix," and
"AND/OR/NOT" to be used. For more information, refer to the [fusejs.io
documentation](https://fusejs.io/examples.html#extended-search).

Press the Tab key to move the focus to the elements in
[\[suggest\]](#suggest), and press the Escape key to return the focus.
The selected element can be added to the positive (negative) prompt by
pressing Enter (or Shift + Enter).

### \[2\] Suggest Filters

Only elements with a check in these filters will be displayed in
[\[suggest\]](#suggest).

### \[3\] Suggest Area <span id="suggest"></span>

Displays a list of up to 20 elements similar to the content entered in
[\[input-field\]](#input-field). An example of the items to be added is
shown in the following image.

<figure>
<img src="docs/images/suggest-items.png" alt="Image - Suggest Items" />
</figure>

Green is Textual Inversion, blue is LoRA, and the last is Danbooru tags.
Clicking (or Shift-clicking) these elements allows them to be added to
the positive (negative) prompt.

LoRA cannot be added to the negative prompt, so please be careful.

You can check the thumbnail by right-clicking on the elements of Textual
Inversion and LoRA.

## Prompt Editing

Prompt editing is done using the two elements shown in the following
image.

<figure>
<img src="docs/images/prompt-component.png"
alt="Image - Prompt Component" />
</figure>

### \[1\] Positive Prompt <span id="positive-prompt"></span>

Prompts added using [\[input-form\]](#input-form) are displayed in this
area. This element is synchronized with the positive prompt input area
of the web UI.

Each prompt can be reordered by drag and drop, and can be deleted by
clicking while holding the Shift key.

Right-clicking on LoRA and normal prompts displays a popup for adjusting
the emphasis level.

### \[2\] Negative Prompt

Except for not being able to add LoRA, it is the same as
[\[positive-prompt\]](#positive-prompt).

# Configuration

Better Prompt creates its own configuration section in the Settings tab.
Here, we will explain each item.

<figure>
<img src="docs/images/settings.png" alt="Image - Settings" />
</figure>

## Version of Better Prompt <span id="version_change"></span>

You can change the version of Better Prompt. The default value is blank
(the latest version at the time of installation). If you change the
settings, it is necessary to restart the Web UI. (not just reload)

The current version of Better Prompt is displayed in the console of the
Web UI. Refer to the table below for the Web UI versions corresponding
to each version.

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<tbody>
<tr class="odd">
<td style="text-align: left;"><p>Version</p></td>
<td style="text-align: left;"><p>Web UI Version (Minimum)</p></td>
<td style="text-align: left;"><p>Web UI Version (Maximum)</p></td>
</tr>
<tr class="even">
<td style="text-align: left;"><p>0.1.0</p></td>
<td style="text-align: left;"><p>9e1afa9e (2023-03-25)</p></td>
<td style="text-align: left;"><p>~</p></td>
</tr>
</tbody>
</table>

## Display update notifications

If checked, it will display notifications when updates are available.

## Notify of updates only once per version

If checked, it will only notify once for each version when updates are
available.

## Interval at which to display update notifications

Specify the interval for displaying update notifications. The unit is
"days", and the default value is 1 day.

## Language of Better Prompt

Specify the language used by Better Prompt. The default value is blank
(English). Currently, ja\_JP language is available. If you change the
settings, it is necessary to reload the Web UI.

# To-Do List

-   \[ \] Add the feature to set aliases for prompts

-   \[ \] Add to prompt merge feature

-   \[ \] Allow undoing the last added prompt with \[Ctrl + Z\]

-   \[ \] Support for Better Styles

-   \[ \] Support for LoRA Block Weight

-   \[ \] Support other Extra networks

-   \[ \] Support nested prompts

-   \[ \] Support schedule notation (e.g. \[red:green:0.5\])

# License

Better Prompt is developed and published under the MIT license. For
details on the license, please refer to the link below.

[MIT License](./LICENSE)
