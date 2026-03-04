import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/dist/css/rcp.css";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  initialColor: string;
  onChange: (color: string) => void;
  onSave: (color: string) => void;
};

export function ColorEditor({ initialColor, onChange, onSave }: Props) {
  const [color, setColor] = useColor(initialColor);

  return (
    <Sheet modal={true}>
      <SheetTrigger className="flex items-center gap-3 cursor-pointer group transition-all duration-200">
        <div
          className="w-10 h-10 rounded-full border shadow-inner transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg"
          style={{ backgroundColor: color.hex }}
        />
        <span className="text-sm font-medium text-foreground/90 transition-colors duration-200 group-hover:text-primary">
          {chrome.i18n.getMessage("edit_color")}
        </span>
        <Edit className="w-5 h-5 text-primary transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
      </SheetTrigger>
      <SheetContent side="right" >
        <SheetHeader>
          <SheetTitle> {chrome.i18n.getMessage("edit_color")}</SheetTitle>
        </SheetHeader>
          <SheetDescription className="p-4" >
            <ColorPicker
              hideInput={["rgb", "hsv"]}
              color={color}
              onChange={(c) => {
                setColor(c);
                onChange(c.hex);
              }} />
          </SheetDescription>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={() => { onSave(color.hex) }}> {chrome.i18n.getMessage("save_in_history")}</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline"> {chrome.i18n.getMessage("cancel")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet >
  )
}