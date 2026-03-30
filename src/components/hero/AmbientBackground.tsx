"use client";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Radial glow from top-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(212,151,108,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Secondary glow from bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 80% 90%, rgba(122,162,247,0.03) 0%, transparent 70%)",
        }}
      />
      {/* Noise texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.018]">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
