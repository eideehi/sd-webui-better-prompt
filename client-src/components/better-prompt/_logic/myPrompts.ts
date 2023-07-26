import { type Readable, writable } from "svelte/store";
import type { MyPrompt } from "#/my-prompt";
import { updateMyPrompts } from "#/api";

let values: MyPrompt[] = [];
const _myPrompts = writable(values);
export const myPrompts: Readable<MyPrompt[]> = { subscribe: _myPrompts.subscribe };

const _allMyPromptTags = writable<string[]>([]);
export const allMyPromptTags: Readable<string[]> = { subscribe: _allMyPromptTags.subscribe };

_myPrompts.subscribe((values) => {
  _allMyPromptTags.set([...new Set(values.flatMap((value) => value.tags))].sort());
});

let init = false;

export function initMyPrompts(myPrompts: MyPrompt[]): void {
  if (init) return;
  init = true;

  values = [...myPrompts];
  _myPrompts.set(values);
}

export function addMyPrompt(myPrompt: MyPrompt): void {
  if (!init) return;

  const newValues = [...values, myPrompt];
  void updateMyPrompts(newValues).then((success) => {
    if (!success) return;
    values = newValues;
    _myPrompts.set(values);
  });
}

export function removeMyPrompts(myPrompts: MyPrompt[]): void {
  if (!init) return;

  const newValues = values.filter((value) => !myPrompts.includes(value));
  void updateMyPrompts(newValues).then((success) => {
    if (!success) return;
    values = newValues;
    _myPrompts.set(values);
  });
}
