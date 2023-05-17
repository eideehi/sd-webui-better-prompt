export type ExtraNetworksType = "textual-inversion" | "lora";

export type ExtraNetworksData = {
  type: ExtraNetworksType;
  name: string;
  search_term: string;
  thumbnail?: string;
};
