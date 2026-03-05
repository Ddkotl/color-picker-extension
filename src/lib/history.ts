export const INIT_COLOR = "#872469"
const MAX_FREE = 10;
const MAX_PRO = 100;
export function calcMaxHistory(isPro: boolean) {
  return isPro ? MAX_PRO : MAX_FREE;
}

export function getHistory(setHistory: (history: string[]) => void, onLoaded?: (firstColor: string) => void) {
  chrome.storage.local.get(["history"], (result) => {
    const data = result.history as string[];
    if (data) setHistory(result.history as string[] || []);
    if (data.length > 0 && onLoaded) onLoaded(data[0]);
  });
}

export async function saveHistory(
  newColor: string,
  history: string[],
  maxHistory: number,
  setHistory: (history: string[]) => void,
) {
  const updated = [newColor, ...history.filter((c) => c !== newColor)].slice(0, maxHistory);

  setHistory(updated);
  await chrome.storage.local.set({ history: updated });
}

export function downloadHistory(history: string[]) {
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString()
  const a = document.createElement("a");
  a.href = url;
  a.download = `color-history-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export function clearHistory(setHistory: (history: string[]) => void,) {
  chrome.storage.local.set({ history: [INIT_COLOR] });
  setHistory([INIT_COLOR])
}