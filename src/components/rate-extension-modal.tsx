import { useRef, useState } from "react";
import { Star } from "lucide-react";
import { markExtensionRated } from "@/lib/rate";

const WEBSTORE_URL =
  "https://chromewebstore.google.com/detail/YOUR_EXTENSION_ID";

const EMAIL = "KOTL.help.dev@gmail.com";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RateExtensionModal({ open, onClose }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter(star: number) {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
    }
    setHovered(star);
  }

  function handleMouseLeave() {
    leaveTimer.current = setTimeout(() => {
      setHovered(null);
    }, 2000);
  }
  if (!open) return null;

  async function handleRate(value: number) {
    setRating(value);

    if (value >= 4) {
      await markExtensionRated();
      window.open(WEBSTORE_URL, "_blank");
      onClose();
    }
  }

  function sendFeedback() {
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Extension feedback&body=${encodeURIComponent(
      feedback
    )}`;

    window.open(gmail, "_blank");

    setRating(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-radial-primary backdrop-blur-sm">
      <div className="w-80 rounded-2xl bg-background border shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">

        {!rating && (
          <>
            <h3 className="text-lg font-semibold text-center">
              {chrome.i18n.getMessage("enjoying_extension")}
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              {chrome.i18n.getMessage("extension_feedback")}
            </p>

            <div className="flex justify-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = hovered ? star <= hovered : star <= (rating ?? 0);

                return (
                  <Star
                    key={star}
                    size={30}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleRate(star)}
                    className={`
          cursor-pointer transition-all duration-200
          ${active
                        ? "text-yellow-400 fill-yellow-400 scale-110"
                        : "text-muted-foreground"}
        `}
                  />
                );
              })}
            </div>
          </>
        )}

        {rating && rating < 4 && (
          <>
            <h3 className="text-lg font-semibold text-center">
              {chrome.i18n.getMessage("sorry_to_hear")}
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              {chrome.i18n.getMessage("tell_us_what")}
            </p>

            <textarea
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
              placeholder={chrome.i18n.getMessage("your_feedback")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              onClick={sendFeedback}
              className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm hover:opacity-90"
            >
              {chrome.i18n.getMessage("send_feedback")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}