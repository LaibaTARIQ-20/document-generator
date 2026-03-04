import { saveAs } from "file-saver"
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, WidthType, BorderStyle, VerticalAlign,
  HeightRule
} from "docx"
import projectData from "@/data/dummyData"

// A4 page in DXA: 11906 wide, margins 720 each side = 10466 content width
const PAGE_WIDTH = 11906
const MARGIN = 720
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2  // 10466 DXA

const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" }
const borders = { top: border, bottom: border, left: border, right: border }
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }

const loadImageAsArrayBuffer = (src: string): Promise<ArrayBuffer | null> => {
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
      canvas.toBlob((blob) => {
        if (!blob) { resolve(null); return }
        blob.arrayBuffer().then(resolve).catch(() => resolve(null))
      }, "image/png")
    }
    img.onerror = () => resolve(null)
    img.src = absoluteSrc
  })
}

export const downloadWord = async (): Promise<void> => {
  try {
    const activeMembers = projectData.groupMembers.filter(m => m.active)
    const totalCols = activeMembers.length
    const memberColW = Math.floor(CONTENT_WIDTH / totalCols)
    const supColW = Math.floor(CONTENT_WIDTH / 2)
    const supTextColW = Math.floor(supColW * 0.65)
    const supPhotoColW = supColW - supTextColW

    // Load all images
    const memberImages = await Promise.all(
      activeMembers.map(m => loadImageAsArrayBuffer(m.photo))
    )
    const supervisorImage = await loadImageAsArrayBuffer(projectData.supervisor.photo)
    const coSupervisorImage = await loadImageAsArrayBuffer(projectData.coSupervisor.photo)
    const diagramImage = await loadImageAsArrayBuffer(projectData.diagram)

    // ── GROUP MEMBERS TABLE ──
    // Photo row
    const photoRow = new TableRow({
      height: { value: 1500, rule: HeightRule.EXACT },
      children: activeMembers.map((member, i) => {
        const imgBuf = memberImages[i]
        return new TableCell({
          width: { size: memberColW, type: WidthType.DXA },
          borders,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: imgBuf ? [
                new ImageRun({
                  data: imgBuf,
                  transformation: { width: 65, height: 85 },
                  type: "png"
                })
              ] : [new TextRun({ text: "" })]
            })
          ]
        })
      })
    })

    // Name row
    const nameRow = new TableRow({
      height: { value: 400, rule: HeightRule.EXACT },
      children: activeMembers.map((member) => {
        return new TableCell({
          width: { size: memberColW, type: WidthType.DXA },
          borders,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 60, bottom: 60, left: 80, right: 80 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: member.name,
                  font: "Times New Roman",
                  size: 20
                })
              ]
            })
          ]
        })
      })
    })

    const membersTable = new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: Array(totalCols).fill(memberColW),
      rows: [photoRow, nameRow]
    })

    // ── SUPERVISOR TABLE ──
    const makeSupCell = (
      label: string,
      sup: typeof projectData.supervisor,
      imgBuf: ArrayBuffer | null
    ) => {
      // Inner table: text col | photo col
      const innerTable = new Table({
        width: { size: supColW, type: WidthType.DXA },
        columnWidths: [supTextColW, supPhotoColW],
        rows: [
          new TableRow({
            children: [
              // Text column
              new TableCell({
                width: { size: supTextColW, type: WidthType.DXA },
                borders: { ...noBorders, right: border },
                verticalAlign: VerticalAlign.TOP,
                margins: { top: 60, bottom: 60, left: 80, right: 80 },
                children: sup.active ? [
                  new Paragraph({
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
                    children: [
                      new TextRun({
                        text: `${sup.degree} (${sup.university})`,
                        font: "Times New Roman",
                        size: 18
                      })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Discipline: ", bold: true, font: "Times New Roman", size: 18 }),
                      new TextRun({ text: sup.discipline, font: "Times New Roman", size: 18 })
                    ]
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Specialization: ", bold: true, font: "Times New Roman", size: 18 }),
                      new TextRun({ text: sup.specialization, font: "Times New Roman", size: 18 })
                    ]
                  })
                ] : [new Paragraph({ children: [] })]
              }),
              // Photo column
              new TableCell({
                width: { size: supPhotoColW, type: WidthType.DXA },
                borders: noBorders,
                verticalAlign: VerticalAlign.CENTER,
                margins: { top: 60, bottom: 60, left: 60, right: 60 },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: imgBuf && sup.active ? [
                      new ImageRun({
                        data: imgBuf,
                        transformation: { width: 65, height: 80 },
                        type: "png"
                      })
                    ] : [new TextRun({ text: "" })]
                  })
                ]
              })
            ]
          })
        ]
      })

      return new TableCell({
        width: { size: supColW, type: WidthType.DXA },
        borders,
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [
          // Heading row
          new Paragraph({
            border: { bottom: border },
            spacing: { before: 80, after: 80 },
            children: [
              new TextRun({
                text: label,
                bold: true,
                font: "Times New Roman",
                size: 22
              })
            ],
            indent: { left: 80 }
          }),
          // Inner table with text + photo
          innerTable
        ]
      })
    }

    const supervisorsTable = new Table({
      width: { size: CONTENT_WIDTH, type: WidthType.DXA },
      columnWidths: [supColW, supColW],
      rows: [
        new TableRow({
          children: [
            makeSupCell("Project Supervisor", projectData.supervisor, supervisorImage),
            makeSupCell("Project Co-Supervisor", projectData.coSupervisor, coSupervisorImage)
          ]
        })
      ]
    })

    // ── BUILD DOCUMENT ──
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: PAGE_WIDTH, height: 16838 },
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN }
          }
        },
        children: [

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 40 },
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

          // Horizontal divider
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000", space: 1 } },
            spacing: { after: 160 },
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

          // Members table
          membersTable,

          new Paragraph({ spacing: { after: 120 }, children: [] }),

          // Supervisors table
          supervisorsTable,

          new Paragraph({ spacing: { after: 120 }, children: [] }),

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
          ...(diagramImage ? [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: diagramImage,
                  transformation: { width: 600, height: 350 },
                  type: "png"
                })
              ]
            })
          ] : [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Diagram not available",
                  font: "Times New Roman",
                  size: 20
                })
              ]
            })
          ])
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, "project-document.docx")

  } catch (error) {
    console.error("Word generation failed:", error)
  }
}