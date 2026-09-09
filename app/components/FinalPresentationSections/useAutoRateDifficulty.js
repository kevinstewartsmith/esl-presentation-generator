// useAutoRateDifficulty.js
// Auto-generates CEFR difficulty ratings for the detail questions when:
//   - the transcript + questions (with answers) are present, AND
//   - not every question is already rated.
// Runs once when prerequisites are first met (like the gist auto-generate).
// Persists via setDetailRatings. Costs a fraction of a cent per batch.

import { useEffect, useRef } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

export function useAutoRateDifficulty() {
  const comprehensionItems = useAudioTextStore((s) => s.comprehensionItems);
  const s2tTranscript = useAudioTextStore((s) => s.s2tTranscript);
  const detailRatings = useAudioTextStore((s) => s.detailRatings);
  const setDetailRatings = useAudioTextStore((s) => s.setDetailRatings);

  const inFlight = useRef(false);

  useEffect(() => {
    const items = comprehensionItems ?? [];
    const transcript = (s2tTranscript ?? "").trim();

    // Prerequisites: transcript + at least one question with a question+answer.
    const rateable = items.filter(
      (it) => (it?.question ?? "").trim() && (it?.answer ?? "").trim(),
    );
    if (!transcript || rateable.length === 0) return;

    // Already rated? (every index present in detailRatings)
    const ratings = detailRatings ?? {};
    const allRated = items.every((_it, i) => ratings[i]);
    if (allRated) return;

    if (inFlight.current) return;
    inFlight.current = true;

    (async () => {
      try {
        const res = await fetch("/api/rate-difficulty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript,
            questions: items.map((it) => ({
              question: it?.question ?? "",
              answer: it?.answer ?? "",
            })),
          }),
        });
        if (!res.ok) throw new Error(`rate-difficulty ${res.status}`);
        const { ratings: arr } = await res.json();

        // Array -> index-keyed map, merged over any existing ratings.
        const map = { ...(detailRatings ?? {}) };
        (arr ?? []).forEach((r, i) => {
          if (r && r.level) map[i] = { level: r.level, reason: r.reason ?? "" };
        });
        setDetailRatings(map);
      } catch (e) {
        console.error("auto-rate difficulty failed:", e);
      } finally {
        inFlight.current = false;
      }
    })();
  }, [comprehensionItems, s2tTranscript, detailRatings, setDetailRatings]);
}
