import { useState, useEffect, useCallback } from "react";
import { useAudioTextStore } from "@app/stores/useAudioTextStore";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const CATALOG = [
  {
    type: "leadIn",
    label: "Lead-in",
    blurb: "Generate interest, set the topic",
    skills: ["listening", "reading"],
    requires: [],
  },
  {
    type: "preTeach",
    label: "Pre-teach vocabulary",
    blurb: "Unblock key words for the task",
    skills: ["listening", "reading"],
    requires: [],
  },
  {
    type: "gist",
    label: "Listen for gist",
    blurb: "Global understanding, main idea",
    skills: ["listening"],
    requires: [],
  },
  {
    type: "scramble",
    label: "Decode & unscramble",
    blurb: "Reorder the passage from audio",
    skills: ["listening"],
    requires: ["snippets"],
  },
  {
    type: "detail",
    label: "Listen for detail",
    blurb: "Detailed comprehension questions",
    skills: ["listening"],
    requires: [],
  },
  {
    type: "peerCheck",
    label: "Peer check",
    blurb: "Compare answers with a partner",
    skills: ["listening", "reading", "speaking"],
    requires: [],
  },
  {
    type: "productive",
    label: "Productive task",
    blurb: "Personal response to the text",
    skills: ["listening", "reading"],
    requires: [],
  },
];
const CATALOG_BY_TYPE = Object.fromEntries(CATALOG.map((c) => [c.type, c]));
const REDUCED_PRESET = ["gist", "scramble", "detail"];

let _id = 0;
const makeId = () => `stage_${Date.now()}_${_id++}`;
const seedFromPreset = (types) =>
  types.map((type) => ({ id: makeId(), type, included: true }));

function DropLine() {
  return (
    <div style={st.dropLineWrap} aria-hidden>
      <span style={st.dropDot} />
      <span style={st.dropLine} />
      <span style={st.dropDot} />
    </div>
  );
}

function SortableCard({ item, index, onToggle, onRemove }) {
  const def = CATALOG_BY_TYPE[item.type];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...st.card,
    ...(item.included ? {} : st.cardOff),
    ...(isDragging ? { opacity: 0.4 } : {}),
  };
  return (
    <li ref={setNodeRef} style={style}>
      <button
        style={st.handle}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <span style={st.dot} />
        <span style={st.dot} />
        <span style={st.dot} />
        <span style={st.dot} />
        <span style={st.dot} />
        <span style={st.dot} />
      </button>
      <div style={st.stepNum}>{index + 1}</div>
      <div style={st.cardBody}>
        <div style={st.cardTitleRow}>
          <span style={st.cardTitle}>{def?.label ?? item.type}</span>
          {def?.requires?.includes("snippets") && (
            <span style={st.reqBadge}>needs audio</span>
          )}
        </div>
        <div style={st.cardBlurb}>{def?.blurb}</div>
      </div>
      <div style={st.cardActions}>
        <button
          onClick={() => onToggle(item.id)}
          style={{
            ...st.toggle,
            ...(item.included ? st.toggleOn : st.toggleOff),
          }}
          title={item.included ? "Included" : "Excluded"}
        >
          <span
            style={{
              ...st.toggleKnob,
              transform: item.included ? "translateX(16px)" : "translateX(0)",
            }}
          />
        </button>
        <button
          onClick={() => onRemove(item.id)}
          style={st.remove}
          title="Remove"
        >
          ×
        </button>
      </div>
    </li>
  );
}

function TrickItem({ trick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: `bag:${trick.type}`,
      data: { fromBag: true, type: trick.type },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    ...st.trick,
    ...(isDragging ? { opacity: 0.4 } : {}),
  };
  return (
    <button ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span style={st.trickPlus}>⋮⋮</span>
      <span>
        <span style={st.trickLabel}>{trick.label}</span>
        <span style={st.trickBlurb}>{trick.blurb}</span>
      </span>
      {trick.requires.includes("snippets") && (
        <span style={st.trickReq}>audio</span>
      )}
    </button>
  );
}

function ListDropZone({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: "list-drop" });
  return (
    <ol ref={setNodeRef} style={{ ...st.list, ...(isOver ? st.listOver : {}) }}>
      {children}
    </ol>
  );
}

export default function StageComposer() {
  const slideOrder = useAudioTextStore((s) => s.slideOrder);
  const updateSlideOrder = useAudioTextStore((s) => s.updateSlideOrder);

  // The store is the source of truth. `items` is just a readable alias.
  const items = slideOrder;

  // Seed from the preset ONCE, only if the store is empty (new lesson).
  useEffect(() => {
    if (!slideOrder || slideOrder.length === 0) {
      updateSlideOrder(seedFromPreset(REDUCED_PRESET));
    }
    // run only on mount / when store identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adapter so existing `setItems(next)` and `setItems(prev => ...)` calls
  // both route through the store without rewriting each call site.
  const setItems = useCallback(
    (updater) => {
      const current = useAudioTextStore.getState().slideOrder;
      const next = typeof updater === "function" ? updater(current) : updater;
      updateSlideOrder(next);
    },
    [updateSlideOrder],
  );
  const [activeDrag, setActiveDrag] = useState(null);
  const [insertAt, setInsertAt] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const addStage = (type, atIndex = null) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { id: makeId(), type, included: true };
      if (atIndex === null || atIndex >= next.length) next.push(item);
      else next.splice(atIndex, 0, item);
      return next;
    });
  };
  const removeStage = (id) => setItems((p) => p.filter((it) => it.id !== id));
  const toggleIncluded = (id) =>
    setItems((p) =>
      p.map((it) => (it.id === id ? { ...it, included: !it.included } : it)),
    );

  function handleDragStart(event) {
    const { active } = event;
    if (active.data.current?.fromBag) {
      setActiveDrag({ fromBag: true, type: active.data.current.type });
    } else {
      setActiveDrag({
        fromBag: false,
        item: items.find((it) => it.id === active.id),
      });
    }
  }

  function handleDragOver(event) {
    const { active, over } = event;
    if (!active.data.current?.fromBag) {
      setInsertAt(null);
      return;
    }
    if (!over) {
      setInsertAt(null);
      return;
    }
    if (over.id === "list-drop") {
      setInsertAt(items.length);
      return;
    }
    const overIndex = items.findIndex((it) => it.id === over.id);
    setInsertAt(overIndex === -1 ? null : overIndex);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    const fromBag = active.data.current?.fromBag;
    const landingIndex = insertAt;
    setActiveDrag(null);
    setInsertAt(null);
    if (!over) return;
    if (fromBag) {
      addStage(active.data.current.type, landingIndex);
      return;
    }
    if (active.id !== over.id) {
      setItems((prev) => {
        const from = prev.findIndex((it) => it.id === active.id);
        const to = prev.findIndex((it) => it.id === over.id);
        if (from === -1 || to === -1) return prev;
        return arrayMove(prev, from, to);
      });
    }
  }

  const draggingFromBag = activeDrag?.fromBag;
  const includedCount = items.filter((it) => it.included).length;

  return (
    <div style={st.page}>
      <style>{keyframes}</style>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveDrag(null);
          setInsertAt(null);
        }}
      >
        <div style={st.workspace}>
          <section style={st.listCol}>
            <header style={st.listHeader}>
              <div>
                <div style={st.eyebrow}>Listening · Gist &amp; Detail</div>
                <h1 style={st.title}>Arrange slides</h1>
              </div>
              <div style={st.count}>
                {includedCount}/{items.length} in the lesson
              </div>
            </header>
            <p style={st.instruction}>
              Drag a card to reorder, or drag an activity from the bag into
              place. Toggle a stage off to keep it out of the slides without
              deleting it.
            </p>
            <SortableContext
              items={items.map((it) => it.id)}
              strategy={verticalListSortingStrategy}
            >
              <ListDropZone>
                {items.map((item, index) => (
                  <div key={item.id}>
                    {draggingFromBag && insertAt === index && <DropLine />}
                    <SortableCard
                      item={item}
                      index={index}
                      onToggle={toggleIncluded}
                      onRemove={removeStage}
                    />
                  </div>
                ))}
                {draggingFromBag && insertAt === items.length && <DropLine />}
                {items.length === 0 && !draggingFromBag && (
                  <div style={st.empty}>
                    Drag an activity here from the bag of tricks.
                  </div>
                )}
              </ListDropZone>
            </SortableContext>
          </section>

          <aside style={st.bagCol}>
            <div style={st.bagHeader}>
              <h2 style={st.bagTitle}>Bag of tricks</h2>
              <span style={st.bagHint}>drag to add</span>
            </div>
            <div style={st.bagList}>
              {CATALOG.map((c) => (
                <TrickItem key={c.type} trick={c} />
              ))}
            </div>
            <div style={st.presetBox}>
              <div style={st.presetLabel}>Preset</div>
              <button
                onClick={() => setItems(seedFromPreset(REDUCED_PRESET))}
                style={st.presetBtn}
              >
                Receptive skills (reduced)
              </button>
              <div style={st.presetNote}>Resets to gist → decode → detail.</div>
            </div>
          </aside>
        </div>

        <DragOverlay>
          {activeDrag ? (
            activeDrag.fromBag ? (
              <div style={{ ...st.trick, ...st.overlayTrick }}>
                <span style={st.trickPlus}>⋮⋮</span>
                <span>
                  <span style={st.trickLabel}>
                    {CATALOG_BY_TYPE[activeDrag.type]?.label}
                  </span>
                </span>
              </div>
            ) : (
              <div style={{ ...st.card, ...st.overlayCard }}>
                <div style={st.handle}>
                  <span style={st.dot} />
                  <span style={st.dot} />
                  <span style={st.dot} />
                  <span style={st.dot} />
                  <span style={st.dot} />
                  <span style={st.dot} />
                </div>
                <div style={{ ...st.stepNum, visibility: "hidden" }}>0</div>
                <div style={st.cardBody}>
                  <span style={st.cardTitle}>
                    {CATALOG_BY_TYPE[activeDrag.item?.type]?.label}
                  </span>
                </div>
              </div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

const INK = "#1c1c1e",
  PAPER = "#faf9f6",
  TEAL = "#2f7d76",
  AMBER = "#c98a2b",
  LINE = "#e6e3db",
  MUTE = "#6f6b63";
const keyframes = `
  @keyframes popIn { from {opacity:0; transform:translateY(6px);} to {opacity:1; transform:none;} }
  @keyframes lineIn { from {opacity:0; transform:scaleX(0.6);} to {opacity:1; transform:scaleX(1);} }
`;
const st = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    background: PAPER,
    color: INK,
    minHeight: "100vh",
    padding: "32px",
    boxSizing: "border-box",
  },
  workspace: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) 300px",
    gap: "28px",
    maxWidth: "980px",
    margin: "0 auto",
    alignItems: "start",
  },
  listCol: {},
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "6px",
  },
  eyebrow: {
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: TEAL,
    fontWeight: 600,
  },
  title: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "34px",
    fontWeight: 600,
    margin: "2px 0 0",
    letterSpacing: "-0.01em",
  },
  count: {
    fontSize: "13px",
    color: MUTE,
    fontVariantNumeric: "tabular-nums",
    paddingBottom: "6px",
  },
  instruction: {
    fontSize: "14px",
    color: MUTE,
    margin: "10px 0 20px",
    maxWidth: "52ch",
  },
  list: {
    listStyle: "none",
    margin: 0,
    padding: "4px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRadius: "12px",
    minHeight: "80px",
    transition: "background 0.15s",
  },
  listOver: { background: `${TEAL}0d` },
  card: {
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    alignItems: "center",
    gap: "14px",
    background: "#fff",
    border: `1px solid ${LINE}`,
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    animation: "popIn 0.18s ease both",
  },
  cardOff: { background: "#f4f2ec", opacity: 0.62 },
  handle: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 4px)",
    gap: "3px",
    background: "none",
    border: "none",
    cursor: "grab",
    padding: "4px",
    touchAction: "none",
  },
  dot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#c9c5bc",
  },
  stepNum: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "18px",
    fontWeight: 600,
    color: TEAL,
    width: "22px",
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
  },
  cardBody: { minWidth: 0 },
  cardTitleRow: { display: "flex", alignItems: "center", gap: "8px" },
  cardTitle: { fontWeight: 600, fontSize: "15px" },
  reqBadge: {
    fontSize: "10.5px",
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: AMBER,
    background: `${AMBER}18`,
    border: `1px solid ${AMBER}44`,
    borderRadius: "5px",
    padding: "1px 6px",
    textTransform: "uppercase",
  },
  cardBlurb: { fontSize: "13px", color: MUTE, marginTop: "2px" },
  cardActions: { display: "flex", alignItems: "center", gap: "10px" },
  toggle: {
    width: "34px",
    height: "18px",
    borderRadius: "9px",
    border: "none",
    padding: 0,
    cursor: "pointer",
    position: "relative",
    transition: "background 0.15s",
  },
  toggleOn: { background: TEAL },
  toggleOff: { background: "#cfcbc2" },
  toggleKnob: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "#fff",
    transition: "transform 0.15s",
    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
  },
  remove: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: `1px solid ${LINE}`,
    background: "#fff",
    color: MUTE,
    fontSize: "16px",
    lineHeight: 1,
    cursor: "pointer",
  },
  empty: {
    padding: "28px",
    textAlign: "center",
    color: MUTE,
    border: `1.5px dashed ${LINE}`,
    borderRadius: "12px",
    fontSize: "14px",
  },
  dropLineWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "2px 4px",
    margin: "-4px 0",
    animation: "lineIn 0.12s ease both",
  },
  dropLine: {
    flex: 1,
    height: "3px",
    borderRadius: "2px",
    background: TEAL,
    boxShadow: `0 0 8px ${TEAL}88`,
  },
  dropDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: TEAL,
    boxShadow: `0 0 6px ${TEAL}88`,
  },
  bagCol: {
    background: "#fff",
    border: `1px solid ${LINE}`,
    borderRadius: "14px",
    padding: "18px",
    position: "sticky",
    top: "32px",
  },
  bagHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "14px",
  },
  bagTitle: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: "19px",
    fontWeight: 600,
    margin: 0,
  },
  bagHint: { fontSize: "11.5px", color: MUTE },
  bagList: { display: "flex", flexDirection: "column", gap: "8px" },
  trick: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left",
    background: PAPER,
    border: `1px solid ${LINE}`,
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "grab",
    width: "100%",
    touchAction: "none",
  },
  trickPlus: {
    fontSize: "12px",
    color: TEAL,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: "-2px",
  },
  trickLabel: { display: "block", fontWeight: 600, fontSize: "13.5px" },
  trickBlurb: {
    display: "block",
    fontSize: "11.5px",
    color: MUTE,
    marginTop: "1px",
  },
  trickReq: {
    marginLeft: "auto",
    fontSize: "10px",
    fontWeight: 600,
    color: AMBER,
    background: `${AMBER}18`,
    borderRadius: "4px",
    padding: "1px 5px",
    textTransform: "uppercase",
  },
  presetBox: {
    marginTop: "18px",
    paddingTop: "16px",
    borderTop: `1px solid ${LINE}`,
  },
  presetLabel: {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: MUTE,
    fontWeight: 600,
    marginBottom: "8px",
  },
  presetBtn: {
    width: "100%",
    background: INK,
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    padding: "10px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  presetNote: { fontSize: "11.5px", color: MUTE, marginTop: "8px" },
  overlayCard: {
    cursor: "grabbing",
    boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
    width: "420px",
  },
  overlayTrick: {
    cursor: "grabbing",
    boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
    background: "#fff",
  },
};
