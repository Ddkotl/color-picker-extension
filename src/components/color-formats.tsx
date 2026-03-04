import { CopyButton } from "./copy-button";

export function ColorFormats({ hex }: { hex: string }) {
  // const rgb = hexToRgb(hex);
  // const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  // const oklch = hexToOklch(rgb.r, rgb.g, rgb.b);
  // const tailwind = toTailwindClass(hex);

  return (
    <div className="text-sm  space-y-1">
      <div className="flex flex-col gap-2 pt-1">
        <CopyButton text={`HEX: ${hex}`} copy_text={hex} />
        {/* <CopyButton text={`RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`} />
        <CopyButton text={`HSL: ${hsl.h}, ${hsl.s}%, ${hsl.l}%`} />
        <CopyButton text={`OKLCH: ${oklch.l}, ${oklch.c}, ${oklch.h}`} />
        <CopyButton text={`Tailwind: ${tailwind}`} /> */}
      </div>
    </div>
  );
};