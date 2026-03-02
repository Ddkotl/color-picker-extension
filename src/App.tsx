import { Title } from "./components/app-title";
import { ModeToggle } from "./components/mode-toggle";

export function App() {
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
        </div>
    )
}

export default App;