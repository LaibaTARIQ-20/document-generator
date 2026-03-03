interface AbstractProps {
  text: string
}

export default function Abstract({ text }: AbstractProps) {
  return (
    <div style={{ marginBottom: "12px" }}>

      {/* Section Heading */}
      <p style={{
        fontWeight: "bold",
        fontSize: "12px",
        marginBottom: "4px",
        fontFamily: "Times New Roman, serif"
      }}>
        Abstract
      </p>

      {/* Abstract Text */}
      <p style={{
        fontSize: "11px",
        fontFamily: "Times New Roman, serif",
        textAlign: "justify",
        lineHeight: "1.5",
        margin: "0"
      }}>
        {text}
      </p>

    </div>
  )
}

