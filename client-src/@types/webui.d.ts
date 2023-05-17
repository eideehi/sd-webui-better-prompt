// injected-script
declare let localization: Record<string, string>;

// script.js
declare function gradioApp(): Document | ShadowRoot;
declare function get_uiCurrentTabContent(): Nullable<Element>;
declare function onUiLoaded(callback: Callback): void;
declare function onUiTabChange(callback: Callback): void;
declare function onUiUpdate(callback: Callback): void;

// javascript/extraNetworks.js
declare function extraNetworksRequestMetadata(
  event: Event,
  extraPage: string,
  cardName: string
): void;

// javascript/localization.js
declare function getTranslation(text: string): Nullable<string>;

// javascript/ui.js
declare type OptionValue = string | number | boolean;
declare let opts: Record<string, OptionValue>;
declare function updateInput(target: HTMLElement): void;
