type Arg = string | number | boolean;

export function t(key: string, options?: { defaultValue?: string; args?: Arg[] }): string {
  const _key = `better-prompt.${key}`;
  const getDefault = () =>
    options != null && options.defaultValue != null ? options.defaultValue : _key;
  const replaceArgs = (text: string, arg: Arg, index: number) =>
    text.replace(`{${index}}`, String(arg));

  const text = getTranslation(_key) || getDefault();
  const args = options?.args || [];
  return args.reduce<string>(replaceArgs, text);
}
