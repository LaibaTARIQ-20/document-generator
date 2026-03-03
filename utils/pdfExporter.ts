import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export const downloadPDF = async (elementId: string): Promise<void> => {
  try {

    // Step 1 — Find the document div
    const element = document.getElementById(elementId)
    if (!element) {
      console.error("Document element not found")
      return
    }

    // Step 2 — Take screenshot of the div
    const canvas = await html2canvas(element, {
      useCORS: true,         // fixes image loading issues
      allowTaint: true,      // allows tainted canvas
      background: "#ffffff",
      logging: false,
      width: 794,
      height: 1123
    })

    // Step 3 — Convert screenshot to image
    const imgData = canvas.toDataURL("image/png")

    // Step 4 — Create A4 PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4"
    })

    // Step 5 — Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Step 6 — Add image to PDF fitting A4 size
    pdf.addImage(
      imgData,
      "PNG",
      0,          // x position
      0,          // y position
      pdfWidth,   // width
      pdfHeight   // height
    )

    // Step 7 — Download the PDF
    pdf.save("project-document.pdf")

  } catch (error) {
    console.error("PDF generation failed:", error)
  }
}
