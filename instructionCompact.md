# Scramble instructions: compact variant (fits 3 cards)

The cards are sized for the gist slide's 2 cards. Three cards overflow 720px.
Add a compact variant used only by the scramble instructions slide.

## 1. InstructionCard.js — accept + apply a `compact` class
Wherever the root card className is built, add the compact class when the prop
is set. (Add `compact` to the component's props.)

  className={`${styles.card} ${tone === "accent" ? styles.accentCard : styles.primaryCard} ${compact ? styles.compact : ""}`}

## 2. InstructionCard.module.css — append compact overrides
Add at the end:

  /* Compact variant — used when a slide shows 3+ cards (e.g. scramble
     instructions) so they fit the 720px canvas. */
  .compact { min-height: 150px; padding: 20px 30px; border-radius: 30px; }
  .compact .iconCircle { width: 104px; border-width: 6px; }
  .compact .iconArea { gap: 20px; }
  .compact .divider { min-height: 70px; }
  .compact .cardContent { padding-left: 24px; }
  .compact .instructionHeading { font-size: 46px; }
  .compact .question { font-size: 34px; margin-top: 8px; }

## 3. InstructionSlide.js — pass compact + tighten the stack gap
- Add a `compact` prop (default false); pass it into each <InstructionCard compact={compact} />.
- Where ScramblePresSection renders the INSTRUCTIONS slide, pass compact:
    <InstructionSlide ... compact />
- Optionally reduce the stack gap for compact: wrap the list with an inline
  style gap:18px, or add a compact class on the .instructions container.
