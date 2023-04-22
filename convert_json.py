import json
import os


def load_translate():
    for files, dir in os.walk("./data/translate"):
        for f in files:
            if f.endswith(".txt"):
                print(f)
                with open(os.path.join(dir, f), encoding="UTF-8") as f:
                    tags = json.load(f)
                    for tag in tags:
                        print(tag)
                        print(tags[tag])


def translate_json():
    with open("./data/danbooru-tags.json", encoding="UTF-8") as f:
        tags = json.load(f)
