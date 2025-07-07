import { useEffect, useRef, useContext } from "react";
import "reveal.js/dist/reveal.css";

const ThinkPairShairPresSection = () => {
  import("@styles/reveal-hedonic.css");

  //   const revealRef = useRef(null);
  //   console.log(presData);

  //   useEffect(() => {
  //     // Ensure this runs only on the client-side
  //     if (typeof window !== "undefined") {
  //       (async () => {
  //         const Reveal = (await import("reveal.js")).default;
  //         const Markdown = (
  //           await import("reveal.js/plugin/markdown/markdown.esm.js")
  //         ).default;

  //         const deck = new Reveal(revealRef.current, {
  //           plugins: [Markdown],
  //         });
  //         deck.initialize();
  //       })();
  //     }
  //   }, []);

  return (
    <section>
      <h1>Think Pair Share </h1>
      <ul>Slide 1</ul>
    </section>
  );
};

export default ThinkPairShairPresSection;
