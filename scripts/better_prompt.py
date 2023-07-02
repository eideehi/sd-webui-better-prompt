import json
import os
import re
import subprocess
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, List, Any

import gradio as gr
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from modules import scripts, script_callbacks, shared


# noinspection DuplicatedCode
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


class MyPrompt(BaseModel):
    label: str
    tags: list[str]
    prompt: str


GIT = os.environ.get('GIT', "git")
SETTINGS_SECTION = ("better_prompt", "Better Prompt")
EXTENSION_ROOT = scripts.basedir()
LOCALIZATION_DIR = Path(EXTENSION_ROOT).joinpath("locales")
DATA_DIR = Path(EXTENSION_ROOT).joinpath("data")
DANBOORU_TAGS_JSON = DATA_DIR.joinpath("danbooru-tags.json")
USER_DATA_DIR = Path(EXTENSION_ROOT).joinpath("user-data")
UPDATE_INFO_JSON = USER_DATA_DIR.joinpath("update-info.json")
MY_PROMPT_JSON = USER_DATA_DIR.joinpath("my-prompts.json")

git = "git"
available_versions: List[str] = []
available_localization: List[str] = []
localization_dict: Dict[str, str] = {}


# noinspection DuplicatedCode
def get_git_command() -> None:
    global git
    try:
        subprocess.run([git, "-v"], cwd=EXTENSION_ROOT, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       check=True)
    except subprocess.CalledProcessError:
        git = GIT
        subprocess.run([git, "-v"], cwd=EXTENSION_ROOT, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                       check=True)


def print_version() -> None:
    result = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                     shell=True).decode("utf-8")
    print(f"Better Prompt version is {result.strip()}")


def refresh_available_version() -> None:
    versions = subprocess.check_output([git, "tag"], cwd=EXTENSION_ROOT, shell=True).decode("utf-8").splitlines()

    regex = r'(?<=\-\>)\s*(\d+\.\d+\.\d+)'
    fetch_result = subprocess.run([git, "fetch", "--dry-run", "--tags"], cwd=EXTENSION_ROOT, shell=True,
                                  stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    for line in fetch_result.stdout.decode("utf-8").splitlines():
        match = re.search(regex, line)
        if match:
            versions.append(match.group(1))

    global available_versions
    available_versions = [" "] + sorted(versions, key=lambda v: tuple(map(int, v.split("."))), reverse=True)


def change_version() -> None:
    before = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                     shell=True).decode("utf-8")
    subprocess.run([git, "fetch", "-q"], cwd=EXTENSION_ROOT, shell=True)
    if shared.opts.better_prompt_version and (not shared.opts.better_prompt_version.isspace()):
        subprocess.run([git, "reset", "--hard", "-q", shared.opts.better_prompt_version], cwd=EXTENSION_ROOT,
                       shell=True)
    else:
        subprocess.run([git, "reset", "--hard", "-q", "origin"], cwd=EXTENSION_ROOT, shell=True)
    after = subprocess.check_output([git, "log", '--pretty=v%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                    shell=True).decode("utf-8")
    print(f"Better Prompt version changed: {before.strip()} -> {after.strip()}")


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


# noinspection DuplicatedCode
def do_check_for_updates(target_version: str) -> Dict[str, Any]:
    update_info = UpdateInfo(datetime.now(), "")
    if UPDATE_INFO_JSON.exists():
        update_info = UpdateInfo.from_json(UPDATE_INFO_JSON)
        delta = datetime.now() - update_info.timestamp
        if delta.days < shared.opts.better_prompt_update_notify_inverval:
            return {"update": False}

    newer_version = find_newer_version(target_version)
    if not newer_version:
        return {"update": False}

    if shared.opts.better_prompt_update_notify_only_once_per_version and newer_version == update_info.version:
        return {"update": False}

    update_info = UpdateInfo(datetime.now(), newer_version)
    update_info.to_json(UPDATE_INFO_JSON)

    return {"update": True, "version": newer_version}


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
    @app.get("/better-prompt-api/v1/check-for-updates")
    async def check_for_updates(request: Request):
        version = subprocess.check_output([git, "log", '--pretty=%(describe:tags)', "-n", "1"], cwd=EXTENSION_ROOT,
                                          shell=True).decode("utf-8")
        version = version.strip().split("-")[0]
        return JSONResponse(content=do_check_for_updates(version))

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


script_callbacks.on_app_started(on_app_started)


def on_ui_settings():
    shared.opts.add_option("better_prompt_version",
                           shared.OptionInfo("", _("Version of Better Prompt (requires restart Web UI)"), gr.Dropdown,
                                             lambda: {"choices": available_versions}, refresh=refresh_available_version,
                                             onchange=change_version, section=SETTINGS_SECTION)),
    shared.opts.add_option("better_prompt_update_notify_enabled",
                           shared.OptionInfo(True, _("Display update notifications"), section=SETTINGS_SECTION))
    shared.opts.add_option("better_prompt_update_notify_only_once_per_version",
                           shared.OptionInfo(False, _("Notify of updates only once per version"),
                                             section=SETTINGS_SECTION))
    shared.opts.add_option("better_prompt_update_notify_inverval",
                           shared.OptionInfo(1, _("Interval at which to display update notifications (Unit: days)"),
                                             gr.Slider, {"minimum": 1, "maximum": 31, "step": 1},
                                             section=SETTINGS_SECTION))
    # shared.opts.add_option("better_prompt_hide_original_prompt", shared.OptionInfo(False,
    # _("Hide the original Prompt"), section = SETTINGS_SECTION))
    shared.opts.add_option("better_prompt_localization",
                           shared.OptionInfo("", _("Language of Better Prompt (requires reload UI)"), gr.Dropdown,
                                             lambda: {"choices": available_localization},
                                             refresh=refresh_available_localization, section=SETTINGS_SECTION)),


script_callbacks.on_ui_settings(on_ui_settings)


def initialize() -> None:
    get_git_command()
    print_version()
    refresh_available_version()
    refresh_available_localization()
    load_localization()


initialize()
