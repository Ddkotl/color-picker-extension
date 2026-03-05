import { useState } from "react";
import { Star } from "lucide-react";

const WEBSTORE_URL =
  "https://chromewebstore.google.com/detail/YOUR_EXTENSION_ID";

const EMAIL = "KOTL.help.dev@gmail.com";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RateExtensionModal({ open, onClose }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  if (!open) return null;

  async function handleRate(value: number) {
    setRating(value);

    if (value >= 4) {
      // await markExtensionRated();
      window.open(WEBSTORE_URL, "_blank");
      onClose();
    }
  }

  function sendFeedback() {
    const mail = `mailto:${EMAIL}?subject=Extension feedback&body=${encodeURIComponent(
      feedback
    )}`;

    window.location.href = mail;
    // markExtensionRated();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded-2xl bg-background border shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">

        {!rating && (
          <>
            <h3 className="text-lg font-semibold text-center">
              Enjoying this extension?
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              Your feedback helps us improve ❤️
            </p>

            <div className="flex justify-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className="cursor-pointer transition hover:scale-110 text-muted-foreground hover:text-yellow-400"
                  onClick={() => handleRate(star)}
                />
              ))}
            </div>
          </>
        )}

        {rating && rating < 4 && (
          <>
            <h3 className="text-lg font-semibold text-center">
              Sorry to hear that 😞
            </h3>

            <p className="text-sm text-muted-foreground text-center">
              Tell us what we can improve.
            </p>

            <textarea
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
              placeholder="Your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <button
              onClick={sendFeedback}
              className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm hover:opacity-90"
            >
              Send feedback
            </button>
          </>
        )}
      </div>
    </div>
  );
}