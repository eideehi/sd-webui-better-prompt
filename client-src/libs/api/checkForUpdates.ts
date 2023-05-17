export type CheckForUpdatesResponse = {
  update: boolean;
  version?: string;
};

export function checkForUpdates(): Promise<CheckForUpdatesResponse> {
  const promise = fetch(`/better-prompt-api/v1/check-for-updates?ts=${new Date().getTime()}`);
  return promise.then((response) => response.json()).then(parseResponse);
}

function parseResponse(json: unknown): CheckForUpdatesResponse {
  if (json == null || typeof json !== "object") return { update: false };
  return isValidResponse(json) ? json : { update: false };
}

function isValidResponse(obj: object): obj is CheckForUpdatesResponse {
  if (typeof obj["update"] !== "boolean") return false;
  return obj["version"] == null || typeof obj["version"] === "string";
}
