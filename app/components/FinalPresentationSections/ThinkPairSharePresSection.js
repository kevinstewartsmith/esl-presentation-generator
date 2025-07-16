import { useEffect, useRef, useContext } from "react";
import "reveal.js/dist/reveal.css";
//import { ThinkPairShareContext } from "@app/contexts/ThinkPairShareContext";
import { useLessonStore } from "@app/stores/UseLessonStore";

const ThinkPairSharePresSection = () => {
  import("@styles/reveal-hedonic.css");
  // const { thinkPhase } = useContext(ThinkPairShareContext);
  const thinkPhase = useLessonStore((state) => state.thinkPhase);

  useEffect(() => {
    console.log("thinkPhase updated in Pres Section:", thinkPhase);
  }, [thinkPhase]);
  console.log("thinkPhase type: ", typeof thinkPhase);

  return (
    <>
      <section>
        <h5>
          Finish the sentences so that they are true for you... (3 minutes){" "}
        </h5>
        {/* <ul>Slide 1</ul>
      <ul>{JSON.stringify(thinkPhase)}</ul> */}
        <ul>
          {Object.values(thinkPhase).map((item, index) => (
            <li key={index}>{item.sentence_stem}</li>
          ))}
        </ul>
      </section>
      <section>
        <h5>Discuss your answers with a partner (3 minutes)</h5>
        <ul>
          {Object.values(thinkPhase).map((item, index) => (
            <li key={index}>{item.prompting_question}</li>
          ))}
        </ul>
      </section>
      <section>
        <h5>Share your answers with the class (3 minutes)</h5>
        <ul>
          {Object.values(thinkPhase).map((item, index) => (
            <li key={index}>{item.sharing_statement}</li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default ThinkPairSharePresSection;
