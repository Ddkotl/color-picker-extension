import { toast } from "sonner";
import { saveHistory } from "./history";

export async function pickColor(
  history: string[],
  maxHistory: number,
  setHistory: (history: string[]) => void,
  setColor: (color: string) => void,
) {
  if (!("EyeDropper" in window)) {
    toast.error("EyeDropper API not supported in this browser.");
    return;
  }

  const eyeDropper = new EyeDropper();

  try {
    const result = await eyeDropper.open();
    setColor(result.sRGBHex);
    toast.success(`Picked color: ${result.sRGBHex}`);
    await saveHistory(result.sRGBHex, history, maxHistory, setHistory);
  } catch {
    console.log("cancelled");
  }
}

export function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    v = max;
  if (max !== min) {
    const d = max - min;
    s = d / max;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
export function hexToOklch(r: number, g: number, b: number) {
  // Convert RGB to XYZ
  let x = r * 0.4124564 + g * 0.2126729 + b * 0.0193339;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.119192;
  let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  // Convert XYZ to LCH
  const l = Math.max(0, Math.min(100, 116 * (y / 100) ** (1 / 3) - 16));
  const c = Math.sqrt(x ** 2 + z ** 2);
  const h = Math.atan2(z, x) * (180 / Math.PI);

  return { l: Math.round(l), c: Math.round(c), h: Math.round(h) };
}

export function toTailwindClass(hex: string) {
  return `bg-[${hex}]`;
}
