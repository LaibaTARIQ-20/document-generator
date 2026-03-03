/* eslint-disable @next/next/no-img-element */
interface DiagramProps {
  imagePath: string
}

export default function Diagram({ imagePath }: DiagramProps) {
  return (
    <div style={{ marginBottom: "12px" }}>

      {/* Section Heading */}
      <p style={{
        fontWeight: "bold",
        fontSize: "12px",
        marginBottom: "8px",
        fontFamily: "Times New Roman, serif"
      }}>
        Diagram
      </p>

      {/* Diagram Image — centered */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <img
          src={imagePath}
          alt="ERD Diagram"
          style={{
            maxWidth: "80%",
            height: "auto",
            objectFit: "contain"
          }}
          onError={(e) => {
            // If diagram not found show placeholder box
            (e.target as HTMLImageElement).style.display = "none" ;
            const placeholder = document.createElement("div");
            placeholder.style.cssText = `
              width: 400px;
              height: 250px;
              background: #f0f0f0;
              border: 1px dashed #999;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #666;
              font-family: Times New Roman, serif;
            `;
            placeholder.innerText = "Diagram not found";
            (e.target as HTMLImageElement).parentNode?.appendChild(placeholder);
          }}
        />
      </div>

    </div>
  )
}
