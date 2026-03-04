import jsPDF from "jspdf"
import projectData from "@/data/dummyData"

const loadImageAsBase64 = (src: string): Promise<string> => {
  return new Promise((resolve) => {
    const absoluteSrc = src.startsWith("http")
      ? src
      : `${window.location.origin}${src}`

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }
    img.onerror = () => resolve("")
    img.src = absoluteSrc
  })
}

export const downloadPDF = async (): Promise<void> => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    })

    const pageW = doc.internal.pageSize.getWidth()
    const margin = 40
    const contentW = pageW - margin * 2
    let y = 40

    // ── TITLE ──
    doc.setFont("times", "bold")
    doc.setFontSize(16)
    const titleW = doc.getTextWidth(projectData.title)
    doc.text(projectData.title, (pageW - titleW) / 2, y)
    y += 22

    // ── SDG ──
    doc.setFont("times", "normal")
    doc.setFontSize(12)
    projectData.sdgs.forEach((sdg) => {
      const sdgW = doc.getTextWidth(sdg)
      doc.text(sdg, (pageW - sdgW) / 2, y)
      y += 16
    })
    y += 6

    // ── DIVIDER ──
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(margin, y, pageW - margin, y)
    y += 16

    // ── GROUP MEMBERS HEADING ──
    doc.setFont("times", "bold")
    doc.setFontSize(12)
    doc.text("Group Members", margin, y)
    y += 10

    // ── GROUP MEMBERS TABLE ──
    const activeMembers = projectData.groupMembers.filter(m => m.active)
    const totalCols = activeMembers.length
    const colW = contentW / totalCols
    const photoRowH = 110
    const nameRowH = 30

    const memberPhotos = await Promise.all(
      activeMembers.map((m) => loadImageAsBase64(m.photo))
    )

    // Photo row cells
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    for (let i = 0; i < totalCols; i++) {
      const x = margin + i * colW
      doc.rect(x, y, colW, photoRowH)
    }

    // Member photos
    activeMembers.forEach((member, i) => {
      const x = margin + i * colW
      const imgBase64 = memberPhotos[i]
      if (imgBase64) {
        const imgW = 60
        const imgH = 80
        const imgX = x + (colW - imgW) / 2
        const imgY = y + (photoRowH - imgH) / 2
        doc.addImage(imgBase64, "PNG", imgX, imgY, imgW, imgH)
      } else {
        const cx = x + colW / 2
        const cy = y + photoRowH / 2
        doc.setFillColor(156, 163, 175)
        doc.circle(cx, cy - 18, 16, "F")
        doc.ellipse(cx, cy + 22, 22, 16, "F")
      }
    })

    y += photoRowH

    // Name row
    for (let i = 0; i < totalCols; i++) {
      const x = margin + i * colW
      doc.rect(x, y, colW, nameRowH)
    }

    activeMembers.forEach((member, i) => {
      const x = margin + i * colW
      doc.setFont("times", "normal")
      doc.setFontSize(10)
      const nameW = doc.getTextWidth(member.name)
      doc.text(member.name, x + (colW - nameW) / 2, y + nameRowH / 2 + 3.5)
    })

    y += nameRowH + 14

    // ── SUPERVISORS TABLE ──
    const supColW = contentW / 2
    const supRowH = 120
    const textColW = supColW * 0.65
    const photoColW = supColW * 0.35
    const headingH = 20

    const supPhotos = await Promise.all([
      loadImageAsBase64(projectData.supervisor.photo),
      loadImageAsBase64(projectData.coSupervisor.photo)
    ])

    const supData = [projectData.supervisor, projectData.coSupervisor]
    const supLabels = ["Project Supervisor", "Project Co-Supervisor"]

    // Outer supervisor boxes
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.rect(margin, y, supColW, supRowH)
    doc.rect(margin + supColW, y, supColW, supRowH)

    supData.forEach((sup, i) => {
      const x = margin + i * supColW
      const dividerX = x + textColW
      const headingBottomY = y + headingH

      // Horizontal line below heading
      doc.setDrawColor(0)
      doc.setLineWidth(0.5)
      doc.line(x, headingBottomY, x + supColW, headingBottomY)

      // Vertical line between text and photo columns
      doc.line(dividerX, headingBottomY, dividerX, y + supRowH)

      // Heading label
      doc.setFont("times", "bold")
      doc.setFontSize(11)
      doc.text(supLabels[i], x + 6, y + 13)

      if (sup.active) {
        let ty = headingBottomY + 12

        // Name
        doc.setFont("times", "bold")
        doc.setFontSize(10)
        doc.text(sup.name, x + 6, ty)
        ty += 12

        // Degree
        doc.setFont("times", "normal")
        doc.setFontSize(9)
        const degreeLines = doc.splitTextToSize(
          `${sup.degree} (${sup.university})`,
          textColW - 12
        )
        doc.text(degreeLines, x + 6, ty)
        ty += degreeLines.length * 11

        // Discipline
        doc.setFont("times", "bold")
        doc.setFontSize(9)
        const discLabel = "Discipline: "
        doc.text(discLabel, x + 6, ty)
        doc.setFont("times", "normal")
        doc.text(
          sup.discipline,
          x + 6 + doc.getTextWidth(discLabel),
          ty
        )
        ty += 11

        // Specialization
        doc.setFont("times", "bold")
        const specLabel = "Specialization: "
        doc.text(specLabel, x + 6, ty)
        doc.setFont("times", "normal")
        const specLines = doc.splitTextToSize(
          sup.specialization,
          textColW - 12 - doc.getTextWidth(specLabel)
        )
        doc.text(specLines, x + 6 + doc.getTextWidth(specLabel), ty)

        // Photo — centered in photo column between heading line and box bottom
        const imgBase64 = supPhotos[i]
        const imgW = 50
        const imgH = 65
        const imgX = dividerX + (photoColW - imgW) / 2
        const availableH = supRowH - headingH
        const imgY = headingBottomY + (availableH - imgH) / 2
        if (imgBase64) {
          doc.addImage(imgBase64, "PNG", imgX, imgY, imgW, imgH)
        } else {
          doc.setFillColor(156, 163, 175)
          doc.circle(dividerX + photoColW / 2, headingBottomY + availableH / 2, 14, "F")
        }
      }
    })

    y += supRowH + 14

    // ── ABSTRACT ──
    doc.setFont("times", "bold")
    doc.setFontSize(12)
    doc.text("Abstract", margin, y)
    y += 14

    doc.setFont("times", "normal")
    doc.setFontSize(10)
    const cleanAbstract = projectData.abstract
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    const abstractLines = doc.splitTextToSize(cleanAbstract, contentW)
    abstractLines.forEach((line: string, idx: number) => {
      const isLast = idx === abstractLines.length - 1
      if (isLast) {
        doc.text(line, margin, y)
      } else {
        doc.text(line, margin, y, { maxWidth: contentW, align: "justify" })
      }
      y += 14
    })

    y += 10

    // ── DIAGRAM ──
    doc.setFont("times", "bold")
    doc.setFontSize(12)
    doc.text("Diagram", margin, y)
    y += 12

    const diagramBase64 = await loadImageAsBase64(projectData.diagram)
    if (diagramBase64) {
      doc.addImage(diagramBase64, "PNG", margin, y, contentW, 200)
    } else {
      doc.setDrawColor(180)
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, y, contentW, 180, "FD")
      doc.setTextColor(120)
      doc.setFontSize(10)
      doc.text("Diagram not found", pageW / 2 - 40, y + 90)
      doc.setTextColor(0)
    }

    doc.save("project-document.pdf")

  } catch (error) {
    console.error("PDF generation failed:", error)
  }
}