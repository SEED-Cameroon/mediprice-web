/**
 * MediPrice mark: a price tag with a medical cross ("health prices").
 * `tone="brand"` is a green tile with a white tag (favicon, light pages);
 * `tone="inverse"` is a white tile with a green tag (on the green header).
 */
const Logo = ({ tone = "brand", className = "" }) => {
  const tile = tone === "inverse" ? "#ffffff" : "#006c49";
  const tag = tone === "inverse" ? "#006c49" : "#ffffff";

  return (
    <svg viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill={tile} />
      <g transform="translate(32 32) scale(1.14) rotate(-18) translate(-32 -32)">
        <path
          d="M13 32 L22 21.5 Q23.4 20 25.5 20 H48 Q52 20 52 24 V40 Q52 44 48 44 H25.5 Q23.4 44 22 42.5 Z"
          fill={tag}
        />
        <circle cx="21.5" cy="32" r="2.8" fill={tile} />
        <path
          d="M35 25.5 h4.5 v4.25 h4.25 v4.5 h-4.25 v4.25 h-4.5 v-4.25 h-4.25 v-4.5 h4.25 z"
          fill={tile}
        />
      </g>
    </svg>
  );
};

export default Logo;
