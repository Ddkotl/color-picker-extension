import { Copy } from "lucide-react";
import { Button } from "./ui/button";

export function CopyButton({ color }: { color: string }) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(color);
  };

  return (
    <Button onClick={copyToClipboard}>
      <Copy className="w-4 h-4 text-primary" />
    </Button>
  );
}
