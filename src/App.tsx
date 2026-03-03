import { useEffect, useState } from "react";
import { Title } from "./components/app-title";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { hexToOklch, hexToRgb, pickColor, rgbToHsl, toTailwindClass } from "./lib/color";
import { SidebarClose } from "lucide-react";
import { calcMaxHistory, downloadHistory, getHistory, saveHistory } from "./lib/history";
import { copyTextToClipboard } from "./lib/clipboard";

export function App() {
    const [color, setColor] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isPro] = useState<boolean>(true);

    const maxHistory = calcMaxHistory(isPro);

    useEffect(() => {
        getHistory(setHistory);
        setColor(history[0] || null);
    }, []);

    const renderFormats = (hex: string) => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const oklch = hexToOklch(hex);
        const tailwind = toTailwindClass(hex);

        return (
            <div className="text-sm space-y-1">
                <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" onClick={() => copyTextToClipboard(hex)}>
                        HEX: {hex}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyTextToClipboard(hex)}>
                        RGB: {rgb.r}, {rgb.g}, {rgb.b}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyTextToClipboard(hex)}>
                        HSL: {hsl.h}, {hsl.s}%, {hsl.l}%
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyTextToClipboard(tailwind)}>
                        OKLCH: {oklch.l.toFixed(2)}, {oklch.c.toFixed(2)}, {oklch.h.toFixed(2)}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyTextToClipboard(tailwind)}>
                        Tailwind: {tailwind}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 w-full  flex flex-col gap-4 bg-radial-primary">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Title text={chrome.i18n.getMessage("extension_name")} align="left" size="lg" />
                <ModeToggle />
                <Button onClick={() => window.close()}>
                    <SidebarClose className="w-4 h-4" />{" "}
                </Button>
            </div>

            <Button onClick={() => pickColor(history, maxHistory, setHistory, setColor)}>Pick Color</Button>

            {/* Current Color */}
            {color && (
                <div className="flex flex-col gap-2 p-3 border rounded">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border cursor-pointer" style={{ backgroundColor: color }} />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                                saveHistory(e.target.value, history, maxHistory, setHistory);
                            }}
                        />
                    </div>
                    {renderFormats(color)}
                </div>
            )}

            {/* History */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">
                        History ({history.length}/{maxHistory})
                    </span>
                    {isPro && (
                        <Button size="sm" onClick={() => downloadHistory(history)}>
                            Download
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-8 gap-2">
                    {history.map((c) => (
                        <div
                            key={c}
                            onClick={() => setColor(c)}
                            className="w-6 h-6 rounded border cursor-pointer"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>

                {/* {!isPro && history.length >= MAX_FREE && (
                    <div className="text-xs text-red-500 pt-2">
                        Free limit reached. Upgrade to Pro for 100 colors + export.
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default App;
