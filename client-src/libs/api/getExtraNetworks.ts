import type { ExtraNetworksData, ExtraNetworksType } from "../extra-networks";
import { omitNulls } from "#/util/array";
import { isObject, isString } from "#/util/types";

export function getExtraNetworks(type: ExtraNetworksType): Promise<ExtraNetworksData[]> {
  const promise = fetch(
    `/better-prompt-api/v1/get-extra-networks/${type}?ts=${new Date().getTime()}`
  );
  return promise
    .then((response) => response.json())
    .then((json) =>
      omitNulls(parseResponse(json).map((element) => parseExtraNetworksData(element, type)))
    );
}

function parseResponse(json: unknown): unknown[] {
  if (json == null || !Array.isArray(json)) return [];
  return json;
}

function parseExtraNetworksData(
  obj: unknown,
  type: ExtraNetworksType
): Nullable<ExtraNetworksData> {
  if (!isObject(obj)) return null;
  if (!isString(obj["name"])) return null;
  if (!isString(obj["search_term"])) return null;

  if (!isString(obj["preview"])) {
    return {
      type,
      name: obj["name"],
      search_term: obj["search_term"],
    };
  }

  return {
    type,
    name: obj["name"],
    search_term: obj["search_term"],
    thumbnail: `url("${obj["preview"]}")`,
  };
}
