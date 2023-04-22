import Fuse from "fuse.js";

export type DanbooruTagCategory = "general" | "character" | "copyright";

const _danbooruTagsMap: Partial<Record<DanbooruTagCategory, DanbooruTag[]>> = {};
const _danbooruTagFuseMap: Partial<Record<DanbooruTagCategory, Fuse<DanbooruTag>>> = {};

function categoryAsString(category: number): DanbooruTagCategory | null {
  switch (category) {
    case 0:
      return "general";
    case 3:
      return "copyright";
    case 4:
      return "character";
  }
  return null;
}

function createDanbooruTagFuse(data: DanbooruTag[]): Fuse<DanbooruTag> {
  return new Fuse(data, {
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ["name", "zh_cn"],
  });
}



export function getDanbooruTagFuse(category: DanbooruTagCategory): Fuse<DanbooruTag> {
  return _danbooruTagFuseMap[category] || createDanbooruTagFuse([]);
}

export function initDanbooruTags(tags: DanbooruTag[]): void {
  // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects#answer-34890276
  const tagsByCategory = tags.reduce((x, y) => {
    (x[y.category] = x[y.category] || []).push(y);
    return x;
  }, {} as Record<number, DanbooruTag[]>);

  [0, 3, 4].forEach((numCategory) => {
    const strCategory = categoryAsString(numCategory);
    if (strCategory == null) return;

    const array: DanbooruTag[] = [];
    _danbooruTagsMap[strCategory] = array;
    (tagsByCategory[numCategory] || []).forEach((tag) => {
      array.push(tag);
    });

    _danbooruTagFuseMap[strCategory] = createDanbooruTagFuse(array);
  });
}
