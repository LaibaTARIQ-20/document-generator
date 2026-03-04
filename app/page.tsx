/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useRef, useState } from "react"
import Document from "@/components/Document"
import { downloadPDF } from "@/utils/pdfExporter"
import { downloadWord } from "@/utils/wordExporter"

export default function Home() {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [wordLoading, setWordLoading] = useState(false)

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    setPdfLoading(true)
    await downloadPDF()
    setPdfLoading(false)
  }

  // Handle Word Download
 const handleDownloadWord = async () => {
  setWordLoading(true)
  await downloadWord()
  setWordLoading(false)
}

  return (
    <main style={{
      backgroundColor: "#f3f4f6",
      minHeight: "100vh",
      padding: "40px 20px"
    }}>

      {/* ── Top Bar with 2 Buttons ── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginBottom: "32px"
      }}>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          style={{
            backgroundColor: pdfLoading ? "#9ca3af" : "#dc2626",
            color: "#ffffff",
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: pdfLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {pdfLoading ? (
            <>
              ⏳ Generating PDF...
            </>
          ) : (
            <>
              📄 Download PDF
            </>
          )}
        </button>

        {/* Download Word Button */}
        <button
          onClick={handleDownloadWord}
          disabled={wordLoading}
          style={{
            backgroundColor: wordLoading ? "#9ca3af" : "#2563eb",
            color: "#ffffff",
            padding: "10px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: wordLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {wordLoading ? (
            <>
              ⏳ Generating Word...
            </>
          ) : (
            <>
              📝 Download Word
            </>
          )}
        </button>

      </div>

      {/* ── Document Preview ── */}
      <div style={{
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "inline-block",
        width: "100%"
      }}>
        <Document />
      </div>

    </main>
  )
}