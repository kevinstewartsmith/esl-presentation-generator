// icons.js
// Every icon in this theme. All draw with `currentColor` so the card/frame
// controls the colour. Theme-owned: content never picks an icon, it picks a
// role, and the slide maps role -> icon.

export function HeadphonesIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M14 34V29C14 19 22 11 32 11C42 11 50 19 50 29V34"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="8" y="31" width="11" height="20" rx="5" fill="currentColor" />
      <rect x="45" y="31" width="11" height="20" rx="5" fill="currentColor" />
    </svg>
  );
}

export function EarIcon() {
  return (
    <svg viewBox="29 29 340 340" fill="none" aria-hidden="true">
      <path
        d="M105.488 117.524C113.408 99.7187 120.359 78.852 137.7 68.0142C219.412 16.9436 304.012 96.8239 291.596 183.735C284.41 234.037 231.516 260.946 210.472 303.034C192.435 339.108 121.338 372.909 115.629 321.526"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M229.563 238.612C271.782 193.835 261.136 88.7032 191.386 91.8739C138.895 94.26 151.137 164.677 163.351 189.103"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M152.723 155.103C208.642 151.222 227.658 210.091 191.382 246.368C181.932 255.816 163.669 242.087 152.723 247.56C141.774 253.035 133.574 270.289 122.785 257.701"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LightbulbIcon() {
  return (
    <svg viewBox="1.5 -2.5 96 96" fill="none" aria-hidden="true">
      <path
        d="M34 60C25 54 20 45 22 35C24 22 35 14 49 14C64 14 76 25 76 39C76 48 71 55 64 60C59 64 58 68 58 73H40C40 68 39 64 34 60Z"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M39 74H59M41 82H57M45 89H53"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M49 2V8M19 14L24 20M79 14L74 20M8 42H15M84 42H91"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MiniWaveform({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 90 36" aria-hidden="true">
      {[8, 14, 25, 34, 20, 12, 7].map((height, index) => (
        <rect
          key={index}
          x={index * 12 + 4}
          y={(36 - height) / 2}
          width="5"
          height={height}
          rx="2.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function AudioWaveform() {
  const bars = [8, 18, 30, 48, 70, 46, 22, 34, 55, 80, 45, 24, 15];

  return (
    <svg viewBox="0 0 320 120" aria-hidden="true">
      {bars.map((height, index) => (
        <rect
          key={index}
          x={index * 23 + 9}
          y={(120 - height) / 2}
          width="9"
          height={height}
          rx="4.5"
          fill="currentColor"
        />
      ))}
    </svg>
  );
}

export function QuestionBubbles() {
  return (
    <svg viewBox="0 0 220 150" fill="none" aria-hidden="true">
      <path
        d="M38 15H111C129 15 143 29 143 47V76C143 94 129 108 111 108H76L52 129V108H38C20 108 6 94 6 76V47C6 29 20 15 38 15Z"
        fill="currentColor"
        opacity=".35"
      />
      <path
        d="M97 49C97 37 107 29 120 29C133 29 143 37 143 49C143 59 137 64 129 69C123 73 120 76 120 84"
        stroke="white"
        strokeWidth="9"
        strokeLinecap="round"
        opacity=".85"
      />
      <circle cx="120" cy="96" r="5" fill="white" opacity=".85" />
      <path
        d="M114 65H182C198 65 210 77 210 93V111C210 127 198 139 182 139H162L145 151V139H114C98 139 86 127 86 111V93C86 77 98 65 114 65Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="7"
        opacity=".75"
      />
      <path
        d="M130 90C130 81 138 75 147 75C157 75 165 81 165 90C165 98 160 102 154 105C150 108 147 111 147 117"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="147" cy="127" r="4" fill="currentColor" />
    </svg>
  );
}
