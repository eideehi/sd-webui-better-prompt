export function tagToPrompt(tag: string): string {
  return replaceAll(tag, {
    _: " ",
    "(": "\\(",
    ")": "\\)",
  });
}

function replaceAll(text: string, dic: Record<string, string>): string {
  let result = text;
  Object.entries(dic).forEach(([key, value]) => {
    result = result.split(key).join(value);
  });
  return result;
}
