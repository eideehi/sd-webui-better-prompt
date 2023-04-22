import json
import os
import googletrans
from googletrans import Translator

print(googletrans.LANGUAGES)

translator = Translator()


def goole_translate(txt, src="en", dest="zh-cn"):
    try:
        result = translator.translate(txt, dest)
        print(f"{txt} -> {result.text}")
        return result.text
    except Exception as e:
        print(e)
        return None


def load_translate(input_path):
    en2zh = {}
    for root, dirs, files in os.walk(input_path):
        for fn in files:
            if not fn.endswith(".txt"):
                continue
            print(f"Loading {fn}...")
            with open(os.path.join(root, fn), encoding="UTF-8") as f:
                lines = f.readlines()
                for line in lines:
                    line = line.strip().split("=")
                    if len(line) != 2:
                        continue
                    en2zh.update({line[0]: line[1]})
    print(f"Loaded {len(en2zh)} translations")
    return en2zh


def translate_json():
    en2zh = load_translate("../image2text_prompt_generator/data/translate_cache/tags/")
    with open("./data/danbooru-tags.json", encoding="UTF-8") as f:
        tags = json.load(f)
    print(f"Loaded {len(tags)} tags")
    for tag in tags:
        if tag["name"] in en2zh:
            tag["zh_cn"] = en2zh[tag["name"]]
        else:
            # print(f"Translating {tag['name']}...")
            # text = translator.translate(tag["name"], src="en", dest="zh-cn")
            # if text is not None:
            #     tag["zh_cn"] = text
            # else:
            tag["zh_cn"] = ""
    with open("./data/danbooru-tags-zh-cn-1.json", "w+", encoding="UTF-8") as f:
        f.write(json.dumps(tags, ensure_ascii=False, indent=4))


if __name__ == "__main__":
    translate_json()
