// detailConfigHelpers.js
// Small readers for detailConfig so the "absent = default on" convention lives
// in ONE place (used by the DetailCard and DetailPresSection alike).

// Stage modes default ON (both recap-all and slide-by-slide) until the teacher
// turns one off.
export function getDetailModes(detailConfig) {
  return {
    showAllOnOneSlide: detailConfig?.showAllOnOneSlide ?? true,
    showSlideBySlide: detailConfig?.showSlideBySlide ?? true,
  };
}

// Per-question flags default ON (review + playClip) unless an override says no.
export function getQuestionFlags(detailConfig, index) {
  const pq = detailConfig?.perQuestion?.[index];
  return {
    review: pq?.review ?? true,
    playClip: pq?.playClip ?? true,
  };
}
