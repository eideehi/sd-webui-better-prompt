import json
import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, List, Any

import gradio as gr
import lark
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from modules import scripts, script_callbacks, shared


@dataclass
class UpdateInfo:
    timestamp: datetime
    version: str

    @classmethod
    def from_json(cls, file_path: Path) -> "UpdateInfo":
        if file_path.is_file():
            data = json.loads(file_path.read_text(encoding="UTF-8"))
            timestamp = datetime.strptime(data['timestamp'], '%Y-%m-%d %H:%M:%S')
            version = data["version"]
            return cls(timestamp, version)
        return cls(datetime.now(), "")

    def to_json(self, file_path: Path):
        if not file_path.exists():
            file_path.parent.mkdir(parents=True, exist_ok=True)
        data = {"timestamp": self.timestamp.strftime('%Y-%m-%d %H:%M:%S'), "version": self.version}
        file_path.write_text(json.dumps(data), encoding="UTF-8")


class TreeToJson(lark.Transformer):
    def prompt(self, value):
        return filter_none_fields(value)

    def scheduled(self, value):
        get_or_none = lambda x: None if not x else x[0]
        flat = lambda x: get_or_none(x) if isinstance(x, list) else x
        values = [flat(x) for x in value]
        return {"type": "scheduled", "from": values[0], "to": values[1], "when": values[2]["value"]}

    def emphasized(self, value):
        multiplier = None
        if len(value) == 5:
            multiplier = value[3]["value"]

        (paren,) = value[0]
        if paren == "(":
            return {"type": "emphasized", "negative": False, "values": list(value[1]), "multiplier": multiplier}
        else:
            return {"type": "emphasized", "negative": True, "values": list(value[1]), "multiplier": multiplier}

    def number(self, value):
        (value,) = value
        value = int(value) if value.isdigit() else float(value)
        return {"type": "number", "value": value}

    def text(self, value):
        (value,) = value
        return value

    extranetworks = lambda self, x: {"type": "extranetworks", "args": list(x)}
    alternate = list
    extranetworksparam = lambda self, x, text=text: text(self, x)
    plain = lambda self, x, text=text: {"type": "plain", "value": text(self, x)}
    separator = lambda self, _: None
    whitespace = lambda self, _: {"type": "whitespace"}


GIT = os.environ.get('GIT', "git")
SETTINGS_SECTION = ("better_prompt_chinese", "Better Prompt Chinese")
EXTENSION_ROOT = scripts.basedir()
LOCALIZATION_DIR = Path(EXTENSION_ROOT).joinpath("locales")
DATA_DIR = Path(EXTENSION_ROOT).joinpath("data")
DANBOORU_TAGS_JSON = DATA_DIR.joinpath("danbooru-tags.json")
USER_DATA_DIR = Path(EXTENSION_ROOT).joinpath("user-data")
UPDATE_INFO_JSON = USER_DATA_DIR.joinpath("update-info.json")

PROMPT_PARSER = lark.Lark(r"""
  ?start: (prompt | /[][():]/+)*
  prompt: (extranetworks | emphasized | scheduled | alternate | plain | separator | whitespace)*
  extranetworks: "<" extranetworksparam (":" extranetworksparam)+ ">"
  !emphasized: "(" prompt ")"
             | "(" prompt ":" number ")"
             | "[" prompt "]"
  scheduled: "[" [prompt ":"] prompt ":" number "]"
  alternate: "[" prompt ("|" prompt)+ "]"
  extranetworksparam: /[^:<>]+/
  !plain: /([^\\\[\]():|,]|\\.)+/
  separator: /\s*,\s*/
  whitespace: [WS]
  number: SIGNED_NUMBER
  %import common.SIGNED_NUMBER
  %import common.WS
  %ignore WS
""")

available_versions: List[str] = []
available_localization: List[str] = []
localization_dict: Dict[str, str] = {}


def find_newer_version(target_version: str) -> str:
    target_parts = list(map(int, target_version.split(".")))
    for version in available_versions:
        if not version.strip():
            continue
        version_parts = list(map(int, version.split(".")))
        if len(version_parts) < len(target_parts):
            version_parts.extend([0] * (len(target_parts) - len(version_parts)))
        elif len(version_parts) > len(target_parts):
            target_parts.extend([0] * (len(version_parts) - len(target_parts)))
        if version_parts > target_parts:
            return version
    return ""


def refresh_available_localization() -> None:
    if LOCALIZATION_DIR.is_dir():
        global available_localization
        available_localization = [" "] + [f.stem for f in LOCALIZATION_DIR.glob("*.json") if f.is_file()]


def load_localization() -> None:
    try:
        localization = shared.opts.better_prompt_localization
    except:
        return

    if localization in available_localization:
        file_path = LOCALIZATION_DIR.joinpath("{}.json".format(localization))
        if file_path.is_file():
            global localization_dict
            localization_dict = json.loads(file_path.read_text(encoding="UTF-8"))


def _(text: str) -> str:
    if text in localization_dict:
        return localization_dict[text]
    return text


def filter_none_fields(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: filter_none_fields(v) for k, v in obj.items() if v is not None}
    elif isinstance(obj, list):
        return [filter_none_fields(elem) for elem in obj if elem is not None]
    else:
        return obj


def on_app_started(demo: Optional[gr.Blocks], app: FastAPI) -> None:
    @app.get("/better-prompt-api/v1/get-localization")
    async def get_localization(request: Request):
        return JSONResponse(content=localization_dict)

    @app.get("/better-prompt-api/v1/get-danbooru-tags")
    async def all_danbooru_tag(request: Request):
        if DANBOORU_TAGS_JSON.is_file():
            return FileResponse(path=DANBOORU_TAGS_JSON, media_type="application/json")
        else:
            return JSONResponse(content=[])

    @app.post("/better-prompt-api/v1/parse-prompt")
    async def parse_prompt(request: Request):
        body = (await request.body()).decode("utf-8")
        try:
            json_data = TreeToJson().transform(PROMPT_PARSER.parse(body))
            print(json_data)
            if isinstance(json_data, list):
                return JSONResponse(content=json)
            return JSONResponse(content=[])
        except Exception as e:
            print(e)
            return JSONResponse(content=[])


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option(
        "better_prompt_localization",
        shared.OptionInfo(
            "", _("Language of Better Prompt (requires reload UI)"), gr.Dropdown,
            lambda: {"choices": available_localization},
            refresh=refresh_available_localization, section=SETTINGS_SECTION
        )
    ),


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    refresh_available_localization()
    load_localization()


initialize()
