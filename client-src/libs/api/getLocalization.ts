export function getLocalization(): Promise<Record<string, string>> {
  const promise = fetch(`/better-prompt-api/v1/get-localization?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json()).then(parseLocalization);
}

function parseLocalization(json: unknown): Record<string, string> {
  if (json == null || typeof json !== "object") return {};
  return isLocalization(json) ? json : {};
}

function isLocalization(obj: object): obj is Record<string, string> {
  return Object.values(obj).every((value) => typeof value === "string");
}
