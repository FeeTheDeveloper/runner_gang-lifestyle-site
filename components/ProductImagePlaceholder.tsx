"use client";

type ProductImagePlaceholderProps = {
  colorName: string;
  colorHex: string;
  design: string;
  productName: string;
  className?: string;
};

function getDesignLabel(design: string) {
  if (design === "coastal") return "COASTAL SKYLINE";
  if (design === "world") return "WORLD TOUR";
  return design.toUpperCase();
}

function getCityscapePath(design: string) {
  if (design === "coastal") {
    return "M0 92 L0 76 L6 74 L9 70 L12 72 L15 68 L18 70 L22 64 L26 66 L30 60 L33 62 L38 56 L41 58 L45 52 L48 54 L52 48 L55 50 L60 44 L63 50 L67 46 L70 52 L75 48 L78 56 L82 50 L86 60 L90 54 L95 64 L100 58 L100 92 Z";
  }
  return "M0 92 L0 78 L4 76 L5 70 L8 72 L9 66 L12 68 L14 62 L17 64 L20 58 L22 50 L25 56 L29 60 L31 54 L35 56 L37 48 L40 52 L44 56 L48 50 L52 60 L56 52 L60 64 L64 50 L68 56 L72 46 L76 58 L80 52 L84 62 L88 56 L92 66 L96 60 L100 70 L100 92 Z";
}

export default function ProductImagePlaceholder({
  colorName,
  colorHex,
  design,
  productName,
  className
}: ProductImagePlaceholderProps) {
  const tintId = `tint-${design}-${colorName.replace(/\s+/g, "-")}`;
  const skylineId = `sky-${design}-${colorName.replace(/\s+/g, "-")}`;
  const designLabel = getDesignLabel(design);
  const cityscape = getCityscapePath(design);

  return (
    <div
      className={`relative h-full w-full overflow-hidden border-l-2 border-ember bg-obsidian ${
        className ?? ""
      }`}
    >
      <svg
        viewBox="0 0 100 133"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={tintId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colorHex} stopOpacity="0.18" />
            <stop offset="60%" stopColor={colorHex} stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={skylineId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="100" height="133" fill="#0A0A0A" />
        <rect x="0" y="0" width="100" height="133" fill={`url(#${tintId})`} />

        <g
          transform="translate(0 41) scale(1 1)"
          fill={`url(#${skylineId})`}
          opacity="0.95"
        >
          <path d={cityscape} />
        </g>

        <g transform="translate(50 18)" textAnchor="middle">
          <text
            fontFamily="serif"
            fontSize="9"
            fontWeight="700"
            letterSpacing="0.05em"
            fill="#D4A853"
          >
            RG
          </text>
        </g>

        <g transform="translate(50 36)" textAnchor="middle">
          <text
            fontFamily="sans-serif"
            fontSize="3.4"
            letterSpacing="0.32em"
            fill="#F0EBE3"
            opacity="0.92"
          >
            RUNNER GANG LIFESTYLE
          </text>
        </g>

        <g transform="translate(50 128)" textAnchor="middle">
          <text
            fontFamily="sans-serif"
            fontSize="2.6"
            letterSpacing="0.4em"
            fill="#F0EBE3"
            opacity="0.55"
          >
            ESTD 2026
          </text>
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between">
        <div className="font-body text-[10px] uppercase tracking-[0.32em] text-bone/70">
          {designLabel}
        </div>
        <div className="font-body text-[10px] uppercase tracking-[0.32em] text-gold">
          {colorName}
        </div>
      </div>

      <span className="sr-only">{productName} — {colorName} placeholder</span>
    </div>
  );
}
