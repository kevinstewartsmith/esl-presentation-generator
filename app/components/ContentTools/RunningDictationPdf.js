"use client";
// RunningDictationPdf.js — SHARED (ContentTools, not grammar-only).
// Running-dictation cut-strips via @react-pdf/renderer: one sentence per strip,
// the target word/phrase emboldened, a dashed cut-line above AND below every
// strip. The cut-lines run EDGE TO EDGE across the page (easier to cut); the
// sentence text keeps a comfortable side margin. No numbering. Fixed font size,
// strips flow onto more pages as needed (never split — wrap={false}).
//
// sentences: [{ sentence, target }]  — target is the exact substring to bold.

import { Document, Page, View, Text, StyleSheet, pdf } from "@react-pdf/renderer";

const SIDE = 52; // text side margin
const CUT = { borderTopWidth: 1, borderTopColor: "#9aa0a6", borderTopStyle: "dashed" };

const styles = StyleSheet.create({
  // No horizontal page padding -> cut-lines span the full page width.
  page: { paddingTop: 44, paddingBottom: 44, fontFamily: "Helvetica" },
  header: { fontSize: 11, color: "#6b6b6b", marginBottom: 18, textTransform: "uppercase", letterSpacing: 1.2, paddingHorizontal: SIDE },
  strip: { ...CUT, paddingTop: 18, paddingBottom: 18 },
  closing: { ...CUT },
  // Side margin lives on the text, not the page, so lines stay full-width.
  sentence: { fontSize: 16, lineHeight: 1.5, color: "#111111", paddingHorizontal: SIDE },
  bold: { fontFamily: "Helvetica-Bold" },
});

function splitOnTarget(sentence, target) {
  if (!target || !sentence.includes(target)) return [sentence, "", ""];
  const i = sentence.indexOf(target);
  return [sentence.slice(0, i), target, sentence.slice(i + target.length)];
}

function Strip({ sentence, target }) {
  const [before, mid, after] = splitOnTarget(sentence, target);
  return (
    <View style={styles.strip} wrap={false}>
      <Text style={styles.sentence}>
        {before}
        {mid ? <Text style={styles.bold}>{mid}</Text> : null}
        {after}
      </Text>
    </View>
  );
}

export function RunningDictationDocument({ sentences = [], title }) {
  return (
    <Document title={title || "Running Dictation"}>
      <Page size="A4" style={styles.page}>
        {title ? <Text style={styles.header}>{title}</Text> : null}
        {sentences.map((s, i) => (
          <Strip key={i} sentence={s.sentence || ""} target={s.target || ""} />
        ))}
        {/* closing cut-line below the last strip */}
        <View style={styles.closing} />
      </Page>
    </Document>
  );
}

export async function downloadRunningDictationPdf(sentences, { title, fileName } = {}) {
  const blob = await pdf(
    <RunningDictationDocument sentences={sentences} title={title} />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "running-dictation.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
