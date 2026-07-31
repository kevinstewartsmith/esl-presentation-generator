// GistPresSection.js
// Container for the gist stage. Three lines of actual work:
//   1. build the view model from the store
//   2. ask the active theme for its gist slide
//   3. render it inside the reveal <section>
//
// It knows about Zustand. It does not know what the slide looks like.
// The theme knows what the slide looks like. It does not know about Zustand.

import { useSlideComponent } from "@app/presentation/theme/SlideThemeProvider";
import { useGistSlideModel } from "./gistSlideModel";

export default function GistPresSection() {
  const model = useGistSlideModel();
  const GistSlide = useSlideComponent("gist");

  // A theme that hasn't implemented this slide type drops it rather than
  // breaking the deck mid-lesson.
  if (!GistSlide) return null;

  return (
    <section className="slide-full">
      <GistSlide {...model} />
    </section>
  );
}
