export function getOption(optionName: string, defaultValue: string): string;
export function getOption(optionName: string, defaultValue: number): number;
export function getOption(optionName: string, defaultValue: boolean): boolean;
export function getOption(optionName: string, defaultValue: OptionValue): OptionValue {
  const value = opts[optionName];
  if (value == null || typeof value !== typeof defaultValue) return defaultValue;
  return value;
}
