const PICKS_KEY = "color_picks_count";
const RATED_KEY = "extension_rated";
const PICK_LIMIT = 5

export async function registerColorPick(): Promise<boolean> {
  const data = await chrome.storage.local.get([PICKS_KEY, RATED_KEY]);

  if (data[RATED_KEY]) return false;

  const picks = (data[PICKS_KEY] as number ?? 0) + 1;

  await chrome.storage.local.set({
    [PICKS_KEY]: picks >= PICK_LIMIT ? 0 : picks,
  });

  return picks >= PICK_LIMIT;
}

export async function markExtensionRated() {
  await chrome.storage.local.set({
    [RATED_KEY]: true,
  });
}