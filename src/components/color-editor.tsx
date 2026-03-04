import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";

type Props = {
  initialColor: string;
  onChange: (color: string) => void;
  onCommit: (color: string) => void;
};

export function ColorEditor({ initialColor, onChange, onCommit }: Props) {
  const [color, setColor] = useState(initialColor);

  // синхронизация если выбрали цвет из истории
  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  // debounce 2 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      onCommit(color);
    }, 2000);

    return () => clearTimeout(timer);
  }, [color]);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div >

      {/* Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-xl border shadow-inner transition-all"
          style={{ backgroundColor: color }}
        />
        <div className="flex flex-col text-sm">
          <span className="font-medium">{color}</span>
        </div>
      </div>

      {/* Modern Color Picker */}
      <HexColorPicker
        color={color}
        onChange={handleChange}
        className="w-full!"
      />

      {/* Manual HEX input */}
      <input
        value={color}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border text-sm"
      />
    </div>
  );
}