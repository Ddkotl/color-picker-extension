import { useState } from "react";

export function ColorTile({ color, onUpdate }: { color: string, onUpdate: (c: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(color);

  return (
    <div>
      <div
        onClick={() => setShowPicker(!showPicker)}
        style={{
          backgroundColor: currentColor,
          width: 24,
          height: 24,
          borderRadius: 4,
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      />
      {showPicker && (
        <input
          type="color"
          value={currentColor}
          onChange={(e) => {
            setCurrentColor(e.target.value);
            onUpdate(e.target.value);
          }}
        />
      )}
    </div>
  );
}