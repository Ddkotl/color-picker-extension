import { useState } from "react";
import { Title } from "./components/app-title";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
    const [color, setColor] = useState<string | null>(null);

    const pickColor = () => {
        chrome.runtime.sendMessage({
            type: "START_COLOR_PICK"
        });
    };

    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "COLOR_PICKED") {
            setColor(message.color);
        }
    });
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
            </div>
            <button
                onClick={pickColor}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Pick Color
            </button>

            {color && (
                <div className="flex items-center gap-2">

                    <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color }}
                    />

                    <span>{color}</span>

                </div>
            )}
        </div>
    )
}

export default App;