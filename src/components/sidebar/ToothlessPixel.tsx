"use client";

// P = 16px, 8 cols × 6 rows → viewBox "0 0 128 96"
// Color: t-blue (#7AA2F7) — fits the dark navy theme
const BLUE = "#7AA2F7";
const DARK = "#0F1020";

/*
  Pixel grid (col 0-7, row 0-5):

  row 0: . A . . . . A .   <- ear tips at col 1, 6
  row 1: . A A A A A A .   <- head (cols 1-6)
  row 2: A A A D A D A A   <- face; D = dark eye at col 3, 5
  row 3: A A A A A A A A   <- full-width "arms"
  row 4: . A A A A A A .   <- body (cols 1-6)
  row 5: . A A . . A A .   <- feet (cols 1-2, 5-6)
*/
export default function ToothlessPixel() {
  return (
    <div className="w-full max-w-[180px] mx-auto">
      <svg
        viewBox="0 0 128 96"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        shapeRendering="crispEdges"
      >
        {/* Row 0: ear tips */}
        <rect x="16" y="0"  width="16" height="16" fill={BLUE} />
        <rect x="96" y="0"  width="16" height="16" fill={BLUE} />

        {/* Row 1: head top */}
        <rect x="16" y="16" width="96" height="16" fill={BLUE} />

        {/* Row 2: face */}
        <rect x="0"  y="32" width="48" height="16" fill={BLUE} />
        <rect x="64" y="32" width="16" height="16" fill={BLUE} />
        <rect x="96" y="32" width="32" height="16" fill={BLUE} />
        {/* eyes */}
        <rect x="48" y="32" width="16" height="16" fill={DARK} />
        <rect x="80" y="32" width="16" height="16" fill={DARK} />

        {/* Row 3: full-width "arms" */}
        <rect x="0"  y="48" width="128" height="16" fill={BLUE} />

        {/* Row 4: body */}
        <rect x="16" y="64" width="96"  height="16" fill={BLUE} />

        {/* Row 5: two stubby feet */}
        <rect x="16" y="80" width="32"  height="16" fill={BLUE} />
        <rect x="80" y="80" width="32"  height="16" fill={BLUE} />
      </svg>
    </div>
  );
}
