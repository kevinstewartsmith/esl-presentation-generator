// normalizeComprehensionItems.js
// Upgrades old-shape saved lessons to the multi-passage shape at load time, so
// the rest of the app only ever deals with passages[].
//
// OLD shape (pre multi-passage): each item had flat fields —
//   { ...qa, passage: "…", snippetFileNames: "file.wav" | "No Audio", indices? }
// NEW shape:
//   { ...qa, passages: [{ text, indices, snippetFileName }], explanation }
//
// Idempotent: an item that already has a passages[] array is returned untouched,
// so it's safe to run on both freshly-generated and hydrated data.

export function normalizeComprehensionItems(items) {
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    // Already new shape → leave it alone (just guarantee an explanation string).
    if (Array.isArray(item?.passages)) {
      return {
        ...item,
        explanation:
          typeof item.explanation === "string" ? item.explanation : "",
      };
    }

    // Old shape → build a single primary passage from the flat fields.
    const text = typeof item?.passage === "string" ? item.passage : "";
    const legacyClip = item?.snippetFileNames;
    const snippetFileName =
      legacyClip && legacyClip !== "No Audio" ? legacyClip : null;

    const passages = text
      ? [{ text, indices: item?.indices ?? null, snippetFileName }]
      : [];

    return {
      ...item,
      passages,
      explanation:
        typeof item?.explanation === "string" ? item.explanation : "",
    };
  });
}
