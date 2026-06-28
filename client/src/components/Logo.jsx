// Shared YoYo brand logo — single source of truth
// Uses the circular Y icon + "YoYo" wordmark

const Logo = ({ size = "md", iconOnly = false }) => {
  const dims = { sm: 28, md: 34, lg: 42 };
  const fontSizes = { sm: "14px", md: "17px", lg: "20px" };
  const d = dims[size] || dims.md;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", userSelect: "none" }}>
      {/* Circular Y icon */}
      <img 
        src="/logo.png" 
        alt="YoYo Logo" 
        style={{
          width: d,
          height: d,
          flexShrink: 0,
          objectFit: 'contain'
        }} 
      />

      {/* Wordmark — hidden in iconOnly mode */}
      {!iconOnly && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 900,
            fontSize: fontSizes[size] || fontSizes.md,
            color: "var(--color-text, #0d0d1a)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          YoYo
        </span>
      )}
    </div>
  );
};

export default Logo;
