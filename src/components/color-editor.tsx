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
      <SheetTrigger className="flex gap-2">
        <div
          className="w-14 h-14 rounded-xl border shadow-inner cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color.hex }}
        />
        <span className="ml-2 text-sm text-foreground/90">
          Edit Color </span>
        <Edit />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Color</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <ColorPicker
            hideInput={["rgb", "hsv"]}
            color={color}
            onChange={(c) => {
              setColor(c);
              onChange(c.hex);
            }} />
        </SheetDescription>
        <SheetFooter>
          <Button onClick={() => { onSave(color.hex) }}>Save</Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>

  )
}