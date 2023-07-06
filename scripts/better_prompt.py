import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, Optional, List, Any

import gradio as gr
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from modules import scripts, script_callbacks, shared
from modules.paths_internal import extensions_builtin_dir


class MyPrompt(BaseModel):
    label: str
    tags: list[str]
    prompt: str


VERSION = "0.4.0"
SETTINGS_SECTION = ("better_prompt", "Better Prompt")
EXTENSION_ROOT = scripts.basedir()
LOCALIZATION_DIR = Path(EXTENSION_ROOT).joinpath("locales")
DATA_DIR = Path(EXTENSION_ROOT).joinpath("data")
DANBOORU_TAGS_JSON = DATA_DIR.joinpath("danbooru-tags.json")
USER_DATA_DIR = Path(EXTENSION_ROOT).joinpath("user-data")
MY_PROMPT_JSON = USER_DATA_DIR.joinpath("my-prompts.json")

available_localization: List[str] = []
localization_dict: Dict[str, str] = {}


# noinspection DuplicatedCode
def print_version() -> None:
    git = os.environ.get('GIT', "git")
    try:
        result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                         shell=True).decode("utf-8")
    except subprocess.CalledProcessError:
        git = "git"
        try:
            result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                             shell=True).decode("utf-8")
        except subprocess.CalledProcessError:
            result = None

    if result:
        version = result.strip()
        print(f"[Better Prompt] Version {version}")
    else:
        print(f"[Better Prompt] Version {VERSION}")


def do_update_my_prompts(my_prompts: List[MyPrompt]) -> Dict[str, Any]:
    if not MY_PROMPT_JSON.exists():
        MY_PROMPT_JSON.parent.mkdir(parents=True, exist_ok=True)
    data = list(map(lambda x: x.dict(), my_prompts))
    MY_PROMPT_JSON.write_text(json.dumps(data, ensure_ascii=False), encoding="UTF-8")
    return {"success": True}


# noinspection DuplicatedCode
def refresh_available_localization() -> None:
    if LOCALIZATION_DIR.is_dir():
        global available_localization
        available_localization = [" "] + [f.stem for f in LOCALIZATION_DIR.glob("*.json") if f.is_file()]


# noinspection DuplicatedCode
def load_localization() -> None:
    try:
        localization = shared.opts.better_prompt_localization
    except AttributeError:
        return

    if localization in available_localization:
        file_path = LOCALIZATION_DIR.joinpath("{}.json".format(localization))
        if file_path.is_file():
            global localization_dict
            localization_dict = json.loads(file_path.read_text(encoding="UTF-8"))


# noinspection DuplicatedCode
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

    @app.get("/better-prompt-api/v1/get-my-prompts")
    async def get_my_prompts(request: Request):
        if MY_PROMPT_JSON.is_file():
            return FileResponse(path=MY_PROMPT_JSON, media_type="application/json")
        else:
            return JSONResponse(content=[])

    @app.post("/better-prompt-api/v1/update-my-prompts")
    async def update_my_prompts(request: List[MyPrompt]):
        return JSONResponse(content=do_update_my_prompts(request))

    @app.get("/better-prompt-api/v1/get-extra-networks/{extra_network_type}")
    async def get_extra_networks(extra_network_type: str):
        result = []
        match extra_network_type:
            case "lora":
                sys.path.append(extensions_builtin_dir)
                from Lora.ui_extra_networks_lora import ExtraNetworksPageLora
                sys.path.remove(extensions_builtin_dir)

                lora = ExtraNetworksPageLora()
                for item in lora.list_items():
                    result.append(
                        {"name": item["name"], "preview": item["preview"], "search_term": item["search_term"]})
            case "textual-inversion":
                from modules.ui_extra_networks_textual_inversion import ExtraNetworksPageTextualInversion

                ti = ExtraNetworksPageTextualInversion()
                for item in ti.list_items():
                    result.append(
                        {"name": item["name"], "preview": item["preview"], "search_term": item["search_term"]})
        return JSONResponse(content=result)


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option("better_prompt_localization",
                           shared.OptionInfo("", _("Language of Better Prompt (requires reload UI)"), gr.Dropdown,
                                             lambda: {"choices": available_localization},
                                             refresh=refresh_available_localization, section=SETTINGS_SECTION)),


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    print_version()
    refresh_available_localization()
    load_localization()


initialize()
