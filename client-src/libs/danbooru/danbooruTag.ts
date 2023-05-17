export type DanbooruTag = {
  name: string;
  post_count: number;
  category: 0 | 3 | 4;
  is_deprecated: boolean;
  words: string[];
};
