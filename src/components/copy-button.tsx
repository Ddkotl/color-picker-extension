import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { copyTextToClipboard } from "@/lib/clipboard";

export function CopyButton({ text }: { text: string }) {

  return (
    <Button variant="outline" size="sm" className="flex gap-2" onClick={() => copyTextToClipboard(text)}>
      <span>{text}</span>
      <Copy className="w-4 h-4 text-primary" />
    </Button>
  );
}
