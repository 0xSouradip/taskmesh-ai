// Small faceted crystal mark (pure SVG).
export function CrystalMark({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 32" width={size * 0.75} height={size} aria-hidden="true" className="mark">
      <path d="M12 1 20 8v16l-8 7-8-7V8z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M4 8h16M4 24h16M12 1v30M12 8l-8 0M12 8 20 24M12 8 4 24" fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.55" strokeLinejoin="round" />
    </svg>
  );
}
