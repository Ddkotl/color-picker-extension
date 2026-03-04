import { useEffect, useRef, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/styles.css";

type Props = {
  initialColor: string;
  onChange: (color: string) => void;
  onCommit: (color: string) => void;
};

export function ColorEditor({ initialColor, onChange, onCommit }: Props) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useColor(initialColor);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // синхронизация при выборе нового цвета извне
  useEffect(() => {
    const new_color = useColor(initialColor);
    console.log(new_color)
    setColor(new_color[0]);
  }, [initialColor]);

  // debounce сохранения
  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onCommit(color.hex);
      setOpen(false);
    }, 2000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [color]);

  // клик вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDone = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onCommit(color.hex);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="w-14 h-14 rounded-xl border shadow-inner cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color.hex }}
        />
        <input
          value={color.hex}
          onChange={(e) => {
            setColor(useColor(e.target.value)[0]);
            onChange(e.target.value);
          }}
          className="flex-1 px-3 py-2 rounded-md border text-sm"
        />
      </div>

      {/* Dropdown picker */}
      <div
        className={`absolute top-20 left-0 z-50 w-full transition-all duration-200 origin-top ${open
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
      >
        <div className="p-4 rounded-2xl border bg-popover shadow-xl space-y-4">
          <div style={{ width: 300, height: 180 }}>
            <ColorPicker

              color={color}
              onChange={(c) => {
                setColor(c);
                onChange(c.hex);
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleDone}
              className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}