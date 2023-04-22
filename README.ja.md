英語 |[中文](README.zh-CN.md)｜[日本語](README.ja.md)

Better Prompt は、[安定拡散ウェブ
UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)追加する
迅速な入力と編集を支援する UI。

<figure>
<img src="docs/images/overview.png" alt="Image - Overview" />
</figure>

# 概要

ベタープロンプトは、
従来のプロンプト入力と編集。テキストを設定できます
エクストラネットワーク（🎴）を表示せずに反転とLoRA、再配置
ドラッグアンドドロップによるプロンプトの順序、強調レベルの調整
GUI を介してプロンプトを表示します。

# インストール

## ブラウザからのインストール (推奨)

拡張機能の「URLからインストール」オプションからインストールできます
タブ。入力するだけ[ｈっｔｐｓ：／／ぎてゅｂ。こｍ／←おんｇぺい／ｓｄーうぇぶいーべってｒーｐろｍｐｔ。ぎｔ](https://github.com/zhongpei/sd-webui-better-prompt.git)「のURL
拡張機能の git リポジトリ」フィールドを選択し、「インストール」ボタンを押します。

<figure>
<img src="docs/images/install.png" alt="Image - Install" />
</figure>

## Git を使用したインストール

で次のコマンドを実行してインストールすることもできます。
Stable Diffusion Web UI がインストールされているディレクトリ。

    git clone https://github.com/zhongpei/sd-webui-better-prompt.git extensions/sd-webui-better-prompt

## Better Prompt が表示されない、または表示が壊れる

上記の方法でインストールすることで、最新版となります
インストールされています。ただし、Web UI のバージョンによってはうまく動作しない場合があります。
使っている。 Better Prompt が正しく表示されない場合は、
別のバージョンを使用することで問題を解決できる可能性があります。

\[設定] タブから、Better Prompt のバージョンを変更できます。ために
詳細については、 を参照してください。[「バージョン＿変化」](#version_change)。

# 使用法

Better Prompt は、下の画像の赤線で囲まれた部分を追加します。
この追加されたコンテンツの使用方法については、これから説明します。

<figure>
<img src="docs/images/components.png" alt="Image - Components" />
</figure>

## 即時追加フォーム<span id="input-form"></span>

プロンプトを追加するには、次の 3 つの要素を使用します。
画像。

<figure>
<img src="docs/images/input-component.png"
alt="Image - Input Component" />
</figure>

### 「１」プロンプト入力フィールド<span id="input-field"></span>

このフィールドにプロンプ​​トを入力し、Enter キーを押してコンテンツを追加します
肯定的なプロンプトに。または、Shift キーを押しながら
Enter を押してコンテンツを否定プロンプトに追加します。ある場合
入力内容に類似したテキスト反転、LoRA、または Danbooru タグ、
それらはリストに表示されます[「提案」](#suggest)。

Fuse.js は類似性の判定に使用され、さまざまなことが可能です。
「完全一致」、「プレフィックス/サフィックス」、
「AND/OR/NOT」を使います。詳細については、[fusejs.io
ドキュメンテーション](https://fusejs.io/examples.html#extended-search)。

Tab キーを押して、フォーカスを要素に移動します。[「提案」](#suggest)をクリックし、Esc キーを押してフォーカスを戻します。
選択した要素は、次の方法でポジティブ (ネガティブ) プロンプトに追加できます。
Enter (または Shift + Enter) を押します。

### 「２」フィルタを提案

これらのフィルタにチェックが入っている要素のみが表示されます[「提案」](#suggest)。

### 「３」おすすめエリア<span id="suggest"></span>

入力した内容に類似した最大20個の要素のリストを表示します[「入力フィールド」](#input-field).追加されるアイテムの例は、
次の図に示されています。

<figure>
<img src="docs/images/suggest-items.png" alt="Image - Suggest Items" />
</figure>

緑がTextual Inversion、青がLoRA、最後がダンボールのタグです。
これらの要素をクリック (または Shift キーを押しながらクリック) すると、要素を追加できます。
肯定的な (否定的な) プロンプト。

LoRA は否定プロンプトに追加できませんので、ご注意ください。

Textual の要素を右クリックすると、サムネイルを確認できます。
反転と LoRA。

## 迅速な編集

プロンプト編集は、次の 2 つの要素を使用して行われます。
画像。

<figure>
<img src="docs/images/prompt-component.png"
alt="Image - Prompt Component" />
</figure>

### 「１」ポジティブプロンプト<span id="positive-prompt"></span>

を使用して追加されたプロンプト[「入力フォーム」](#input-form)この中に表示されます
エリア。この要素は、正のプロンプト入力領域と同期されます
Web UI の。

各プロンプトは、ドラッグ アンド ドロップで並べ替えたり、削除することができます。
Shiftキーを押しながらクリック。

LoRA と通常のプロンプトを右クリックすると、調整用のポップアップが表示されます
強調レベル。

### 「２」否定的なプロンプト

LoRAが追加できない以外は同じ[「ポジティブプロンプト」](#positive-prompt)。

# 構成

Better Prompt は、\[設定] タブに独自の構成セクションを作成します。
ここでは、各項目について説明します。

<figure>
<img src="docs/images/settings.png" alt="Image - Settings" />
</figure>

## Better Prompt のバージョン<span id="version_change"></span>

Better Prompt のバージョンを変更できます。デフォルト値は空白です
(インストール時の最新バージョン)。を変更すると
Web UI の再起動が必要です。 （リロードだけではない）

Better Prompt の現在のバージョンは、
ウェブ UI。対応する Web UI バージョンについては、次の表を参照してください。
各バージョンに。

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

## 更新通知を表示する

オンにすると、更新が利用可能になったときに通知が表示されます。

## バージョンごとに 1 回だけ更新を通知する

オンにすると、更新時にバージョンごとに 1 回だけ通知されます。
利用可能。

## 更新通知を表示する間隔

更新通知を表示する間隔を指定します。単位は
デフォルト値は 1 日です。

## より良いプロンプトの言語

Better Prompt で使用する言語を指定します。デフォルト値は空白です
（英語）。現在、ジャ＿JP言語が利用可能です。を変更すると
設定するには、Web UI をリロードする必要があります。

# やることリスト

-   「」プロンプトのエイリアスを設定する機能を追加

-   「」プロンプトマージ機能に追加

-   「」最後に追加されたプロンプトを元に戻すことを許可する「Ctrl + Z」

-   「」より良いスタイルのサポート

-   「」LoRA ブロック ウェイトのサポート

-   「」他のエクストラネットワークをサポート

-   「」ネストされたプロンプトをサポート

-   「」サポート スケジュール表記 (例:「赤:緑:0.5」）

# ライセンス

Better Prompt は、MIT ライセンスの下で開発および公開されています。ために
ライセンスの詳細については、以下のリンクを参照してください。

[マイライセンス](./LICENSE)
