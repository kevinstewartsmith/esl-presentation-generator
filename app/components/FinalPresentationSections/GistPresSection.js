// GistPresSection.js
// Placeholder gist slide for the presentation. Renders the teacher's SELECTED
// gist question (from the store) if one was picked; otherwise a stub. Flesh out
// later (instructions slide, peer-check, answer reveal).

import { useAudioTextStore } from "@app/stores/useAudioTextStore";

export default function GistPresSection() {
  const selectedGist = useAudioTextStore((s) => s.selectedGist);

  return (
    <section>
      <h1>Listen for Gist</h1>
      <p>Listen once. What is the main idea?</p>
      {selectedGist?.question && (
        <p style={{ marginTop: "1.5rem", fontWeight: 600 }}>
          {selectedGist.question}
        </p>
      )}
    </section>
  );
}
