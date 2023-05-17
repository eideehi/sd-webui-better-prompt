/**
 * Returns the name of the currently active tab.
 */
export function getCurrentTabName(): WebUiTab {
  const content = get_uiCurrentTabContent();
  if (content == null) {
    return "other";
  }
  const { id } = content;
  if (id.startsWith("tab_")) {
    const tabName = id.slice(4);
    switch (tabName) {
      case "txt2img":
      case "img2img":
        return tabName;
    }
  }
  return "other";
}
