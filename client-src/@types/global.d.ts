// injected-script
declare let localization: Record<string, string>;

// script.js
declare function gradioApp(): Document | ShadowRoot;
declare function get_uiCurrentTabContent(): Element | null;
declare function onUiLoaded(callback: () => void): void;
declare function onUiTabChange(callback: () => void): void;
declare function onUiUpdate(callback: () => void): void;

// javascript/extraNetworks.js
declare function extraNetworksRequestMetadata(event: Event, extraPage: string, cardName: string): void;

// javascript/localization.js
declare function getTranslation(text: string): string | undefined;

// javascript/ui.js
declare type OptionValue = string | number | boolean;
declare let opts: Record<string, OptionValue>;
declare function updateInput(target: HTMLElement): void;
