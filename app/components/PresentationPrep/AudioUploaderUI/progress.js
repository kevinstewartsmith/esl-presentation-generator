export function Progress({ value, animate = true }) {
  return (
    <div
      style={{
        width: "100%",
        height: 6,
        background: "#ececf0",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value || 0}%`,
          height: "100%",
          background: "#2f7d76",
          transition: animate ? "width 400ms ease" : "none",
        }}
      />
    </div>
  );
}
