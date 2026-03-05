import { useEffect, useState } from "react";
import { Title } from "./components/app-title";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { SidebarClose } from "lucide-react";
import { calcMaxHistory, clearHistory, downloadHistory, getHistory, INIT_COLOR, saveHistory } from "./lib/history";
import { pickColor } from "./lib/color";
import { Separator } from "./components/ui/separator";
import { ColorEditor } from "./components/color-editor";
import { ColorFormats } from "./components/color-formats";


export function App() {
    const [color, setColor] = useState<string | null>(INIT_COLOR);
    const [history, setHistory] = useState<string[]>([INIT_COLOR]);
    const [isPro] = useState<boolean>(true);

    const maxHistory = calcMaxHistory(isPro);

    useEffect(() => {
        getHistory(setHistory, (color) => { setColor(color) });
    }, []);

    return (
        <div className="p-4 max-w-90 mx-auto min-h-screen flex flex-col gap-4 bg-radial-primary">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Title className="text-foreground/90" text={chrome.i18n.getMessage("extension_name")} align="left" size="lg" />
                <div className="flex gap-2">
                    <ModeToggle />
                    <Button variant="ghost" size="icon" onClick={() => window.close()}>
                        <SidebarClose className="w-5 h-5 text-primary" />
                    </Button>
                </div>
            </div>
            <Button onClick={() => pickColor(history, maxHistory, setHistory, setColor)}>{chrome.i18n.getMessage("pick_color")}</Button>
            <Separator />
            {/* Current Color */}
            {color && (
                <div className="flex flex-col gap-2 p-3 border">
                    <ColorEditor
                        initialColor={color}
                        onChange={(c) => setColor(c)}
                        onSave={(c) => saveHistory(c, history, maxHistory, setHistory)}
                    />
                    <ColorFormats hex={color} />
                </div>

            )}
            <Separator />
            {/* History */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold">
                        Colors History ({history.length}/{maxHistory})
                    </span>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => clearHistory(setHistory)}>
                            Clear
                        </Button>
                        {isPro && (
                            <Button size="sm" onClick={() => downloadHistory(history)}>
                                Download
                            </Button>
                        )}

                    </div>

                </div>

                <div className="grid grid-cols-8 gap-2">
                    {history.map((c) => {
                        const isActive = c === color; // выбранный цвет

                        return (
                            <div
                                key={c}
                                onClick={() => setColor(c)}
                                className={`
          w-6 h-6 rounded-full cursor-pointer transition-all duration-200
          ${isActive ? "ring-2 ring-primary ring-offset-1 shadow-lg scale-110" : "hover:scale-105 hover:shadow-md"}
        `}
                                style={{ backgroundColor: c }}
                            />
                        );
                    })}
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
