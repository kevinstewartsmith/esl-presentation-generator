// MemorySpeculatePresSection.js
// The reveal.js slide run for the "Memory & Speculate" warm-up/lead-in activity.
// Reads the stage's config (stageActivities[item.id].config) and emits:
//   1. Partner assignment (← Partner A · Partner B →)
//   2. Instructions (memorise your side, no talking, 1 minute)
//   3. Two images (A left, B right)
//   4. Student A — speak 40s (stems)
//   5. Student B — speak 40s (stems)
//
// Uses the hedonic SlideFrame / InstructionSlide directly (one theme for now).
// Stem slides use subtitle (not a long titleAccent) so the header can't overflow,
// and useFitScale so a tall stem stack shrinks to fit instead of clipping.
// [FLAG] register these as proper theme-swappable slide kinds during the keystone
// refactor; image/stems fit + bigger instruction boxes tracked in FLAGS.

"use client";

import SlideFrame from "@app/presentation/theme/hedonic/SlideFrame";
import InstructionSlide from "@app/presentation/theme/hedonic/InstructionSlide";
import { useFitScale } from "@app/presentation/theme/hedonic/useFitScale";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";

export default function MemorySpeculatePresSection({ item }) {
  const stageActivities = useAudioTextStore((s) => s.stageActivities);
  const config = stageActivities?.[item.id]?.config ?? {};
  const A = config.A ?? {};
  const B = config.B ?? {};

  return (
    <>
      {/* 1. Partner assignment */}
      <section className="slide-full">
        <SlideFrame title="Find your" titleAccent="partner">
          <div style={st.assign}>
            <div style={st.assignCol}>
              <span style={st.bigArrow}>←</span>
              <span style={st.pName}>Partner A</span>
            </div>
            <span style={st.vline} />
            <div style={st.assignCol}>
              <span style={st.pName}>Partner B</span>
              <span style={st.bigArrow}>→</span>
            </div>
          </div>
        </SlideFrame>
      </section>

      {/* 2. Instructions */}
      <section className="slide-full">
        <InstructionSlide
          title="Memorise"
          titleAccent="your image"
          lines={[
            "You will see two images.",
            "Partner A — remember everything on the LEFT.",
            "Partner B — remember everything on the RIGHT.",
            "No talking. You have 1 minute.",
          ]}
        />
      </section>

      {/* 3. Two images */}
      <section className="slide-full">
        <SlideFrame title="Memorise" titleAccent="your image">
          <div style={st.imagesRow}>
            <ImageCard side="A" image={A.image} />
            <ImageCard side="B" image={B.image} />
          </div>
        </SlideFrame>
      </section>

      {/* 4. Student A */}
      <section className="slide-full">
        <StemsSlide side="A" stems={A.stems} />
      </section>

      {/* 5. Student B */}
      <section className="slide-full">
        <StemsSlide side="B" stems={B.stems} />
      </section>
    </>
  );
}

function ImageCard({ side, image }) {
  return (
    <div style={st.imgCol}>
      <div style={st.imgTag}>Partner {side}</div>
      {image?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image.url} alt="" style={st.img} />
      ) : (
        <div style={st.imgPlaceholder}>No image chosen</div>
      )}
    </div>
  );
}

function StemsSlide({ side, stems }) {
  const list = Array.isArray(stems) ? stems : [];
  // Re-fit on the stem content so a tall stack shrinks instead of clipping.
  const dep = list.map((s) => s.text).join("|");
  const { ref } = useFitScale(dep, { min: 0.4, max: 1 });

  return (
    <SlideFrame title={`Student ${side}`} subtitle="Speak for 40 seconds">
      <div style={st.fitBox}>
        <div ref={ref} style={st.stemsWrap}>
          {list.length ? (
            list.map((s, i) => (
              <div key={i} style={st.stemLine}>
                {s.text}
              </div>
            ))
          ) : (
            <div style={st.imgPlaceholder}>No stems yet</div>
          )}
        </div>
      </div>
    </SlideFrame>
  );
}

const TEAL = "#2f7d76";
const st = {
  assign: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "60px",
    height: "100%",
  },
  assignCol: { display: "flex", alignItems: "center", gap: "22px" },
  bigArrow: { fontSize: "110px", lineHeight: 1, color: TEAL, fontWeight: 700 },
  pName: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "52px",
    fontWeight: 600,
    color: "#1c1c1e",
  },
  vline: {
    width: "2px",
    height: "220px",
    background: "#e6e3db",
    display: "inline-block",
  },
  imagesRow: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  imgCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    width: "46%",
    minWidth: 0,
  },
  imgTag: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "26px",
    fontWeight: 700,
    color: TEAL,
  },
  img: {
    width: "100%",
    maxHeight: "460px",
    objectFit: "cover",
    borderRadius: "18px",
    border: "3px solid #fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    display: "block",
  },
  imgPlaceholder: {
    width: "100%",
    height: "360px",
    display: "grid",
    placeItems: "center",
    borderRadius: "18px",
    border: "2px dashed #cfcbc2",
    color: "#b8b3a8",
    fontSize: "22px",
    fontStyle: "italic",
  },
  // Fit box: fills the slide body; the stem stack is scaled to fit inside it.
  fitBox: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  stemsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "26px",
    width: "100%",
    maxWidth: "1040px",
    margin: "0 auto",
    transformOrigin: "center center",
  },
  stemLine: {
    fontSize: "36px",
    lineHeight: 1.35,
    color: "#2b2b2b",
    fontFamily: "'Fraunces', Georgia, serif",
  },
};
