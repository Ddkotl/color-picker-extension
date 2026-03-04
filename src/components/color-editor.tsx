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
      <SheetTrigger className="flex gap-2 items-center cursor-pointer">
        <div
          className="w-10 h-10 rounded-full"
          style={{ backgroundColor: color.hex }}
        />
        <span className="ml-2 text-sm text-foreground/90">
          Edit Color </span>
        <Edit className="w-5 h-5 text-primary" />
      </SheetTrigger>
      <SheetContent side="right" >
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
          <SheetClose asChild>
            <Button onClick={() => { onSave(color.hex) }}>Save</Button>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>

  )
}