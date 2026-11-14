// readingDetailModel.js
// Helpers for reading's detail stage. The structured per-question items live in
// useReadingStore.readingItems (the SOURCE OF TRUTH) — this module only:
//   1. parses the raw extraction (JSON strings) into that structured shape, for
//      the one-time migration / "Rebuild from screenshots" action, and
//   2. reads the WHOLE text out of useReadingStore.textbook for the
//      "show the passage on screen" slides.
//
// Item shape: { number, question, answer, passages: [{ text }] }
//   - question/answer: text
//   - passages: per-question evidence excerpts from the reading text (like
//     listening's comprehensionItems[].passages, minus the audio)

import { useReadingStore } from "@app/stores/useReadingStore";

export function parseMaybeJson(v) {
  if (v == null) return null;
  if (typeof v === "object") return v;
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  try { return JSON.parse(s); } catch { return { text: s }; }
}

function asArray(parsed, key) {
  if (!parsed) return [];
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed[key])) return parsed[key];
  return [];
}

// WHOLE reading text → array of passage strings (one per paragraph-group /
// textEdit entry). Used for the "show the passage on screen" slides.
export function wholeTextPassages(textbook) {
  const parsed = parseMaybeJson(textbook);
  if (!parsed) return [];
  if (typeof parsed.text === "string" && parsed.text.trim()) return [parsed.text.trim()];
  if (Array.isArray(parsed.textEdit)) {
    return parsed.textEdit
      .map((e) => (typeof e === "string" ? e : e?.text || ""))
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof parsed === "string" && parsed.trim()) return [parsed.trim()];
  return [];
}

// WHOLE text as one string (for feeding the passage-finder AI).
export function wholeTextString(textbook) {
  return wholeTextPassages(textbook).join("\n\n");
}

// Split the whole reading text into paragraphs (blank-line separated, falling
// back to single newlines if there are no blank lines).
export function textParagraphs(wholeText) {
  const s = String(wholeText || "");
  let parts = s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) parts = s.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  return parts;
}

function normalizeForMatch(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Which paragraph (1-based) a passage comes from — by locating it in the text.
// Exact-contains first, then a leading-fragment fallback. null if not found.
export function paragraphOf(passageText, paragraphs) {
  const np = normalizeForMatch(passageText);
  if (!np || !Array.isArray(paragraphs) || !paragraphs.length) return null;
  for (let i = 0; i < paragraphs.length; i++) {
    if (normalizeForMatch(paragraphs[i]).includes(np)) return i + 1;
  }
  const frag = np.slice(0, 40);
  if (frag.length >= 12) {
    for (let i = 0; i < paragraphs.length; i++) {
      if (normalizeForMatch(paragraphs[i]).includes(frag)) return i + 1;
    }
  }
  return null;
}

// Build the structured items from the raw extraction strings. `prior` (the
// current readingItems) lets a rebuild PRESERVE per-question passages by number
// so re-deriving Q&A doesn't wipe evidence the teacher already has.
export function buildReadingItemsFromStrings({ questions, answers }, prior = []) {
  const qArr = asArray(parseMaybeJson(questions), "questions");
  const aArr = asArray(parseMaybeJson(answers), "answers");

  const numOf = (x, i) =>
    x?.number != null && String(x.number).trim() ? String(x.number) : String(i + 1);

  const qByNum = new Map();
  qArr.forEach((q, i) => qByNum.set(numOf(q, i), q));
  const aByNum = new Map();
  aArr.forEach((a, i) => aByNum.set(numOf(a, i), a));
  const priorByNum = new Map();
  (prior || []).forEach((p) => { if (p?.number != null) priorByNum.set(String(p.number), p); });

  const order = [];
  const seen = new Set();
  const push = (arr) => arr.forEach((x, i) => { const n = numOf(x, i); if (!seen.has(n)) { seen.add(n); order.push(n); } });
  if (aArr.length) push(aArr);
  push(qArr);

  return order.map((num) => {
    const q = qByNum.get(num);
    const a = aByNum.get(num);
    const keptPassages = Array.isArray(priorByNum.get(num)?.passages) ? priorByNum.get(num).passages : [];
    return {
      number: num,
      question: (q?.text || "").trim() || `Number ${num}`,
      answer: (a?.answer || q?.answer || "").trim(),
      passages: keptPassages,
    };
  });
}

// True when there are raw extraction strings but no structured items yet
// (i.e. a lesson that predates readingItems, or a fresh upload).
export function needsBuild(readingItems, questions, answers) {
  const hasItems = Array.isArray(readingItems) && readingItems.length > 0;
  const hasStrings =
    asArray(parseMaybeJson(questions), "questions").length > 0 ||
    asArray(parseMaybeJson(answers), "answers").length > 0;
  return !hasItems && hasStrings;
}

// Hook: the whole-text passages for the deck/card.
export function useWholeTextPassages() {
  const textbook = useReadingStore((s) => s.textbook);
  return wholeTextPassages(textbook);
}
