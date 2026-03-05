/* eslint-disable @typescript-eslint/no-unused-vars */
import { saveAs } from "file-saver"
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, WidthType, BorderStyle, VerticalAlign,
  HeightRule
} from "docx"
import projectData from "@/data/dummyData"

// A4 dimensions in DXA (1 inch = 1440 DXA)
// A4 = 11906 wide, margins 720 each side = 10466 content
const CONTENT_WIDTH = 10466

const solidBorder = { style: BorderStyle.SINGLE, size: 4, color: "000000" }
const allBorders = {
  top: solidBorder,
  bottom: solidBorder,
  left: solidBorder,
  right: solidBorder
}
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
const noBorders = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder
}

// Load image from public folder and convert to ArrayBuffer
const loadImage = (src: string): Promise<ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const url = src.startsWith("http") ? src : `${window.location.origin}${src}`
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext("2d")?.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null)
        blob.arrayBuffer().then(resolve).catch(() => resolve(null))
      }, "image/png")
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export const downloadWord = async (): Promise<void> => {
  try {
    const activeMembers = projectData.groupMembers.filter(m => m.active)
    const totalCols = activeMembers.length

    // Each member column width — equal split
    const memberColW = Math.floor(CONTENT_WIDTH / totalCols)

    // Supervisor columns — each half
    // Each half split: 60% text, 40% photo
    const supColW = Math.floor(CONTENT_WIDTH / 2)
    const supTextW = Math.floor(supColW * 0.60)
    const supPhotoW = supColW - supTextW

    // Load all images
    const memberImages = await Promise.all(
      activeMembers.map(m => loadImage(m.photo))
    )
    const supImage1 = await loadImage(projectData.supervisor.photo)
    const supImage2 = await loadImage(projectData.coSupervisor.photo)
    const diagramImg = await loadImage(projectData.diagram)

    // ─────────────────────────────────────────
    // GROUP MEMBERS TABLE
    // Two rows: photos on top, names on bottom
    // ─────────────────────────────────────────
    const membersTable = new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: Array(totalCols).fill(memberColW),
      rows: [
        // Photo row
        new TableRow({
          height: { value: 1500, rule: HeightRule.EXACT },
          children: activeMembers.map((_, i) =>
            new TableCell({
              width: { size: memberColW, type: WidthType.DXA },
              borders: allBorders,
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 80, bottom: 80, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: memberImages[i] ? [
                    new ImageRun({
                      data: memberImages[i]!,
                      transformation: { width: 65, height: 85 },
                      type: "png"
                    })
                  ] : []
                })
              ]
            })
          )
        }),
        // Name row
        new TableRow({
          height: { value: 400, rule: HeightRule.EXACT },
          children: activeMembers.map((member) =>
            new TableCell({
              width: { size: memberColW, type: WidthType.DXA },
              borders: allBorders,
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 60, bottom: 60, left: 80, right: 80 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: member.name,
                      font: "Times New Roman",
                      size: 18
                    })
                  ]
                })
              ]
            })
          )
        })
      ]
    })

    // ─────────────────────────────────────────
    // SUPERVISORS TABLE
    // Flat 4-column table: [text1 | photo1 | text2 | photo2]
    // Using flat layout avoids Google Docs nested table bugs
    // ─────────────────────────────────────────

    const makeSupTextCell = (
      sup: typeof projectData.supervisor,
      label: string
    ) =>
      new TableCell({
        width: { size: supTextW, type: WidthType.DXA },
        borders: {
          top: solidBorder,
          bottom: solidBorder,
          left: solidBorder,
          right: solidBorder
        },
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 80, bottom: 80, left: 100, right: 80 },
        children: [
          new Paragraph({
            spacing: { after: 60 },
            border: { bottom: solidBorder },
            children: [
              new TextRun({
                text: label,
                bold: true,
                font: "Times New Roman",
                size: 22
              })
            ]
          }),
          ...(sup.active ? [
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: sup.name,
                  bold: true,
                  font: "Times New Roman",
                  size: 20
                })
              ]
            }),
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: `${sup.degree} (${sup.university})`,
                  font: "Times New Roman",
                  size: 16
                })
              ]
            }),
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: "Discipline: ",
                  bold: true,
                  font: "Times New Roman",
                  size: 16
                }),
                new TextRun({
                  text: sup.discipline,
                  font: "Times New Roman",
                  size: 16
                })
              ]
            }),
            new Paragraph({
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: "Specialization: ",
                  bold: true,
                  font: "Times New Roman",
                  size: 16
                }),
                new TextRun({
                  text: sup.specialization,
                  font: "Times New Roman",
                  size: 16
                })
              ]
            })
          ] : [new Paragraph({ children: [] })])
        ]
      })

    const makeSupPhotoCell = (
      imgBuf: ArrayBuffer | null,
      sup: typeof projectData.supervisor
    ) =>
      new TableCell({
        width: { size: supPhotoW, type: WidthType.DXA },
        borders: {
          top: solidBorder,
          bottom: solidBorder,
          left: noBorder,
          right: solidBorder
        },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 60, right: 60 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: imgBuf && sup.active ? [
              new ImageRun({
                data: imgBuf,
                transformation: { width: 65, height: 80 },
                type: "png"
              })
            ] : []
          })
        ]
      })

    // Flat 4-column supervisor table
    const supervisorsTable = new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [supTextW, supPhotoW, supTextW, supPhotoW],
      rows: [
        new TableRow({
          children: [
            makeSupTextCell(projectData.supervisor, "Project Supervisor"),
            makeSupPhotoCell(supImage1, projectData.supervisor),
            makeSupTextCell(projectData.coSupervisor, "Project Co-Supervisor"),
            makeSupPhotoCell(supImage2, projectData.coSupervisor)
          ]
        })
      ]
    })

    // ─────────────────────────────────────────
    // BUILD FULL DOCUMENT
    // ─────────────────────────────────────────
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 720, bottom: 720, left: 720, right: 720 }
          }
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: projectData.title,
                bold: true,
                font: "Times New Roman",
                size: 32
              })
            ]
          }),

          // SDGs
          ...projectData.sdgs.map(sdg =>
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: sdg,
                  font: "Times New Roman",
                  size: 24
                })
              ]
            })
          ),

          // Divider line
          new Paragraph({
            spacing: { after: 160 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: "000000",
                space: 1
              }
            },
            children: []
          }),

          // Group Members heading
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Group Members",
                bold: true,
                font: "Times New Roman",
                size: 24
              })
            ]
          }),

          membersTable,

          new Paragraph({ spacing: { after: 160 }, children: [] }),

          supervisorsTable,

          new Paragraph({ spacing: { after: 160 }, children: [] }),

          // Abstract heading
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Abstract",
                bold: true,
                font: "Times New Roman",
                size: 24
              })
            ]
          }),

          // Abstract text
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 160 },
            children: [
              new TextRun({
                text: projectData.abstract
                  .replace(/\n/g, " ")
                  .replace(/\s+/g, " ")
                  .trim(),
                font: "Times New Roman",
                size: 20
              })
            ]
          }),

          // Diagram heading
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({
                text: "Diagram",
                bold: true,
                font: "Times New Roman",
                size: 24
              })
            ]
          }),

          // Diagram image
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: diagramImg ? [
              new ImageRun({
                data: diagramImg,
                transformation: { width: 580, height: 340 },
                type: "png"
              })
            ] : [
              new TextRun({
                text: "Diagram not available",
                font: "Times New Roman",
                size: 20
              })
            ]
          })
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, "project-document.docx")

  } catch (error) {
    console.error("Word generation failed:", error)
  }
}