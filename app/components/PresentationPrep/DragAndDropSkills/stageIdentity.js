// stageIdentity.js
// Pure-presentation map: stage name -> its muted color accent + icon class.
// Used by the StageSorter cards. No logic, no data — just look-and-feel.
// (Provisional muted palette; canonical stage-identity colors live here later.)

const DEFAULT = { accent: "#b4b2a9", chipBg: "#f1efe8", icon: "#5f5e5a", ti: "ti-square" };

const IDENTITY = {
  "Listening for Gist and Detail": { accent: "#7d9fc9", chipBg: "#eaf0f7", icon: "#3f5f86", ti: "ti-headphones" },
  "Reading for Gist and Detail":   { accent: "#6fa893", chipBg: "#e6f0eb", icon: "#3d6d5b", ti: "ti-book" },
  "Speaking: Debate":              { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-messages" },
  "Speaking: Presentation":        { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-presentation" },
  "Speaking: Role Play":           { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-masks-theater" },
  "Speaking: Survey":              { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-clipboard-text" },
  "Writing: Essay":                { accent: "#a596c9", chipBg: "#efebf6", icon: "#5f5296", ti: "ti-pencil" },
  "Brainstorming":                 { accent: "#c294a6", chipBg: "#f4eaef", icon: "#8a5069", ti: "ti-bulb" },
  "Class Rules":                   { accent: "#9ca67e", chipBg: "#eef1e6", icon: "#5f6b3d", ti: "ti-clipboard-list" },
  "Warm-Up: Board Race":           { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-run" },
  "Warm-Up: Speaking":             { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-microphone" },
  "Effort and Attitude Score":     { accent: "#6fa893", chipBg: "#e6f0eb", icon: "#3d6d5b", ti: "ti-star" },
  "Advantages - Disadvantages":    { accent: "#a596c9", chipBg: "#efebf6", icon: "#5f5296", ti: "ti-scale" },
  "Think - Pair - Share":          { accent: "#cc9370", chipBg: "#f6ece4", icon: "#8f5a37", ti: "ti-users" },
  "Vocabulary":                    { accent: "#9ca67e", chipBg: "#eef1e6", icon: "#5f6b3d", ti: "ti-vocabulary" },
};

export function stageIdentity(name) {
  return IDENTITY[name] ?? DEFAULT;
}
