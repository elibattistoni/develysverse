export default function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 24, height: 1, background: "#7c3aed" }} />
      <span style={{ color: "#9333ea", fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase" }}>
        {text}
      </span>
    </div>
  )
}
