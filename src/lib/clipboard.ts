import { toast } from "sonner";

export async function copyTextToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
};