import { useEffect, useState } from "react";
import { Title } from "./components/app-title";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { hexToRgb, rgbToHsl, toTailwindClass } from "./lib/convert-color";
import { SidebarClose } from "lucide-react";

const MAX_FREE = 10;
const MAX_PRO = 100;

export function App() {
    const [color, setColor] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isPro] = useState(true); // потом заменишь на проверку подписки

    const maxHistory = isPro ? MAX_PRO : MAX_FREE;

    useEffect(() => {
        chrome.storage.local.get(["history"], (result) => {
            if (result.history) setHistory(result.history as string[]);
        });
    }, []);

    const saveHistory = async (newColor: string) => {
        const updated = [
            newColor,
            ...history.filter((c) => c !== newColor),
        ].slice(0, maxHistory);

        setHistory(updated);
        await chrome.storage.local.set({ history: updated });
    };

    const pickColor = async () => {
        if (!("EyeDropper" in window)) {
            alert("Not supported");
            return;
        }

        const eyeDropper = new EyeDropper();

        try {
            const result = await eyeDropper.open();
            setColor(result.sRGBHex);
            await saveHistory(result.sRGBHex);
        } catch {
            console.log("cancelled");
        }
    };

    const copy = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    const downloadHistory = () => {
        const blob = new Blob([JSON.stringify(history, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "color-history.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const renderFormats = (hex: string) => {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        const tailwind = toTailwindClass(hex);

        return (
            <div className="text-sm space-y-1">
                <div>HEX: {hex}</div>
                <div>RGB: {rgb.r}, {rgb.g}, {rgb.b}</div>
                <div>HSL: {hsl.h}, {hsl.s}%, {hsl.l}%</div>
                <div>Tailwind: {tailwind}</div>
                <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={() => copy(hex)}>Copy HEX</Button>
                    <Button size="sm" onClick={() => copy(tailwind)}>Copy TW</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 w-85 flex flex-col gap-4 bg-radial-primary">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Title
                    text={chrome.i18n.getMessage("extension_name")}
                    align="left"
                    size="lg"
                />
                <ModeToggle />
                <Button onClick={() => window.close()} ><SidebarClose className="w-4 h-4" /> </Button>
            </div>

            <Button onClick={pickColor}>
                Pick Color
            </Button>

            {/* Current Color */}
            {color && (
                <div className="flex flex-col gap-2 p-3 border rounded">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded border cursor-pointer"
                            style={{ backgroundColor: color }}
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => {
                                setColor(e.target.value);
                                saveHistory(e.target.value);
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
                        <Button size="sm" onClick={downloadHistory}>
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

                {!isPro && history.length >= MAX_FREE && (
                    <div className="text-xs text-red-500 pt-2">
                        Free limit reached. Upgrade to Pro for 100 colors + export.
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;