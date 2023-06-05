type ExtensionAvailableTab = "txt2img" | "img2img";
type WebUiTab = ExtensionAvailableTab | "other";

type Nullable<T> = T | null | undefined;
type Callback = () => unknown;
type Callback1<T> = (arg1: T) => unknown;

type OneOrMany<T> = T | T[];
