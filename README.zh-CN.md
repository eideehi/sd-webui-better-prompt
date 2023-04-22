英语 |[中文](README.zh-CN.md)\|[日本人](README.ja.md)

Better Prompt 是[稳定扩散网
界面](https://github.com/AUTOMATIC1111/stable-diffusion-webui)这增加了
用于协助提示输入和编辑的 UI。

<figure>
<img src="docs/images/overview.png" alt="Image - Overview" />
</figure>

# 概述

Better Prompt 的创建是为了减少各种不便
传统提示输入和编辑。它允许您设置文本
Inversion 和 LoRA 不显示 Extra networks (🎴)，重新排列
通过拖放来调整提示的顺序，并调整提示的强调程度
通过 GUI 提示。

# 安装

## 从浏览器安装（推荐）

您可以从扩展程序中的“从 URL 安装”选项安装它
标签。只需输入[HTTPS://GitHub.com/中配/山东-Web UI-better-prompt.git](https://github.com/zhongpei/sd-webui-better-prompt.git)在“网址为
扩展的 git 存储库”字段，然后按“安装”按钮。

<figure>
<img src="docs/images/install.png" alt="Image - Install" />
</figure>

## 使用 Git 安装

您也可以通过执行以下命令来安装它
安装 Stable Diffusion Web UI 的目录。

    git clone https://github.com/zhongpei/sd-webui-better-prompt.git extensions/sd-webui-better-prompt

## Better Prompt 不显示或显示坏了

通过使用上述方法安装它，最新版本将是
安装。但是，它可能不适用于您使用的 Web UI 版本
正在使用。如果 Better Prompt 显示不正确，可能是
可以通过使用不同的版本来解决问题。

您可以从“设置”选项卡更改 Better Prompt 的版本。为了
更多信息，请参阅[\[版本\_改变\]](#version_change).

# 用法

Better Prompt 添加了下图中红线包围的部分。
从现在开始我们将解释如何使用这个添加的内容。

<figure>
<img src="docs/images/components.png" alt="Image - Components" />
</figure>

## 提示添加表格<span id="input-form"></span>

添加提示是使用如下所示的三个元素完成的
图像。

<figure>
<img src="docs/images/input-component.png"
alt="Image - Input Component" />
</figure>

### \[1]提示输入字段<span id="input-field"></span>

在此字段中输入提示，然后按回车键添加内容
到积极的提示。或者，按住 Shift 键的同时
按 Enter 将内容添加到否定提示中。如果有
与输入内容相似的Textual Inversion、LoRA或Danbooru标签，
它们将显示在列表中[\[建议\]](#suggest).

Fuse.js 用于相似性确定，允许各种
确定方法，例如“完全匹配”、“前缀/后缀”和
使用“AND/OR/NOT”。有关详细信息，请参阅[fusejs.io
文档](https://fusejs.io/examples.html#extended-search).

按 T​​ab 键将焦点移动到中的元素[\[建议\]](#suggest), 然后按 Escape 键返回焦点。
可以通过以下方式将所选元素添加到正（负）提示中
按 Enter（或 Shift + Enter）。

### \[2]建议过滤器

只有勾选了这些过滤器的元素才会显示在[\[建议\]](#suggest).

### \[3]建议区域<span id="suggest"></span>

显示最多 20 个与输入的内容相似的元素的列表[\[输入字段\]](#input-field).要添加的项目的示例是
如下图所示。

<figure>
<img src="docs/images/suggest-items.png" alt="Image - Suggest Items" />
</figure>

绿色是Textual Inversion，蓝色是LoRA，最后是Danbooru标签。
单击（或按住 Shift 键单击）这些元素可以将它们添加到
正面（负面）提示。

LoRA不能添加到否定提示中，请注意。

您可以通过右键单击 Textual 的元素来查看缩略图
反转和 LoRA。

## 即时编辑

使用如下所示的两个元素完成提示编辑
图像。

<figure>
<img src="docs/images/prompt-component.png"
alt="Image - Prompt Component" />
</figure>

### \[1]正面提示<span id="positive-prompt"></span>

使用添加的提示[\[输入形式\]](#input-form)显示在这个
区域。该元素与正向提示输入区同步
的网络用户界面。

Each prompt can be reordered by drag and drop, and can be deleted by
clicking while holding the Shift key.

右击LoRA，正常提示会弹出调整
重点级别。

### \[2]否定提示

除了不能添加LoRA，其他都一样[\[肯定提示\]](#positive-prompt).

# 配置

Better Prompt 在“设置”选项卡中创建自己的配置部分。
在这里，我们将解释每个项目。

<figure>
<img src="docs/images/settings.png" alt="Image - Settings" />
</figure>

## 更好提示的版本<span id="version_change"></span>

您可以更改 Better Prompt 的版本。默认值为空
（安装时的最新版本）。如果你改变
设置，需要重新启动 Web UI。 （不只是重新加载）

Better Prompt 的当前版本显示在
网络用户界面。对应的Web UI版本见下表
到每个版本。

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

## 显示更新通知

如果选中，它将在更新可用时显示通知。

## 每个版本仅通知更新一次

如果选中，它只会在更新时为每个版本通知一次
可用的。

## 显示更新通知的时间间隔

指定显示更新通知的时间间隔。单位是
“天”，默认值为 1 天。

## 更好提示的语言

指定 Better Prompt 使用的语言。默认值为空
（英语）。目前，贾\_JP语言可用。如果你改变
设置，则需要重新加载 Web UI。

# 待办事项清单

-   \[]添加为提示设置别名的功能

-   \[] Add to prompt merge feature

-   \[]允许撤消最后添加的提示\[Ctrl + Z]

-   \[]支持更好的样式

-   \[]支持 LoRA 块权重

-   \[]支持其他Extra网络

-   \[]支持嵌套提示

-   \[]支持时间表符号（例如\[红:绿:0.5])

# 执照

Better Prompt 是在 MIT 许可下开发和发布的。为了
有关许可证的详细信息，请参阅下面的链接。

[我的执照](./LICENSE)