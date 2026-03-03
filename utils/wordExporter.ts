import { saveAs } from "file-saver"
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx"

export const downloadWord = async (elementId: string): Promise<void> => {
  try {

    const element = document.getElementById(elementId)
    if (!element) {
      console.error("Document element not found")
      return
    }

    // Build Word document using docx library
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [

            // Title
            new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [
                new TextRun({
                  text: "Blockchain based Internet Voting",
                  bold: true,
                  size: 32,
                  font: "Times New Roman"
                })
              ]
            }),

            // SDG
            new Paragraph({
              children: [
                new TextRun({
                  text: "SDG 3: Good health and well-being",
                  size: 26,
                  font: "Times New Roman"
                })
              ]
            }),

            // Spacer
            new Paragraph({ children: [] }),

            // Group Members Heading
            new Paragraph({
              children: [
                new TextRun({
                  text: "Group Members",
                  bold: true,
                  size: 24,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Shaiq e Mustafa | Mutti ur Rehamn | Farhad Gul | Syed Own",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            // Spacer
            new Paragraph({ children: [] }),

            // Supervisor Heading
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Supervisor",
                  bold: true,
                  size: 24,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Dr Usman Akram",
                  bold: true,
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "PhD (National University of Science and Technology)",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Discipline: Computer Engineering",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Specialization: Medical Image / Signal Analysis",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            // Spacer
            new Paragraph({ children: [] }),

            // Co-Supervisor Heading
            new Paragraph({
              children: [
                new TextRun({
                  text: "Project Co-Supervisor",
                  bold: true,
                  size: 24,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Dr Sajid Gul Khawaja",
                  bold: true,
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "PhD (National University of Science and Technology)",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Discipline: Computer Engineering",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Specialization: Digital System Design",
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

            // Spacer
            new Paragraph({ children: [] }),

            // Abstract Heading
            new Paragraph({
              children: [
                new TextRun({
                  text: "Abstract",
                  bold: true,
                  size: 24,
                  font: "Times New Roman"
                })
              ]
            }),

            // Abstract Text
            new Paragraph({
              children: [
                new TextRun({
                  text: `Internet voting is a crucial requirement given the current situation of the voting process worldwide. Block chains can allow for an immutable exchange of data between a central authority and individual nodes. Each constituency is modelled as a node, and is directly channeled with a central authority. The blockchain technology used in the project is Hyperledger Fabric. Fabric, being a permissioned blockchain allows greater control over the transfer and committal of data. This along with a cross-platform flutter based mobile app for the actual voting process, and a website to display the votes helps to create a safe and reliable voting mechanism that fights off voter coercion and can boast being verifiable.`,
                  size: 22,
                  font: "Times New Roman"
                })
              ]
            }),

          ]
        }
      ]
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    saveAs(blob, "project-document.docx")

  } catch (error) {
    console.error("Word generation failed:", error)
  }
}
