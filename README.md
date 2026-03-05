# Document Generator — Project Documentation

---

## 1. Project Overview

This is a **Next.js 14 web application** that generates a formatted academic project poster. Users can preview the document in the browser and download it as either a **PDF** or **Word (.docx)** file.

The document contains:
- Project title and SDG
- Group members (photos + names)
- Project supervisor and co-supervisor details
- Abstract text
- Project diagram/flowchart

---

## 2. Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 + TypeScript | Frontend framework |
| Tailwind CSS v4 | Page UI styling only |
| jsPDF | PDF generation (draws content programmatically) |
| docx library | Word (.docx) generation with real tables |
| file-saver | Triggers browser file download |

---

## 3. Project Structure

```
document-generator/
├── app/
│   ├── page.tsx          → Main page — buttons + document preview
│   ├── layout.tsx        → Root HTML layout (no global fonts)
│   └── globals.css       → Minimal CSS (Tailwind import only)
│
├── components/
│   ├── Document.tsx      → A4 wrapper, renders all sections
│   ├── GroupMembers.tsx  → Member photos + names table
│   ├── Supervisors.tsx   → Supervisor + co-supervisor table
│   ├── Abstract.tsx      → Abstract text block
│   └── Diagram.tsx       → Flowchart image
│
├── data/
│   └── dummyData.ts      → All project data + TypeScript interfaces
│
├── utils/
│   ├── pdfExporter.ts    → PDF generation using jsPDF directly
│   └── wordExporter.ts   → Word generation using docx library
│
└── public/
    ├── photos/           → Member and supervisor photos
    └── diagram/          → Project flowchart image
```

---

## 4. Data Layer — dummyData.ts

**What it does:** Defines all project content in one place using TypeScript interfaces.

```typescript
interface Member {
  id: number
  name: string
  photo: string   // path like "/photos/member1.png"
  active: boolean // false = hide this member from document
}

interface Supervisor {
  name, degree, university, discipline, specialization, photo, active
}
```

**Key design decision:** The `active` field on each member and supervisor controls visibility. Setting `active: false` removes that person from the document — the layout automatically adjusts. For example, if 1 of 4 members is set inactive, the remaining 3 members equally share the full table width.

---

## 5. Component Layer

### Document.tsx
- Acts as the A4 page wrapper (794px width = A4 at 96dpi)
- Uses `forwardRef` so the parent can reference the DOM element
- All styles are inline (no Tailwind) — critical for consistent rendering
- Renders: Title → Divider → GroupMembers → Supervisors → Abstract → Diagram

### GroupMembers.tsx
- Renders an HTML table with 2 rows: photo row and name row
- Only renders `active` members
- Column widths are equal: `contentWidth / activeMembers.length`
- Uses `display: flex` with `alignItems: center` inside name cells for vertical centering

### Supervisors.tsx
- 2-column table (50% each)
- Each cell has a heading row with `borderBottom` separator
- Inner nested table splits each cell into text column (65%) and photo column (35%) with a vertical border between them

### Abstract.tsx
- Simple text block with justified alignment
- Times New Roman font throughout

### Diagram.tsx
- Displays the flowchart image centered
- Has an `onError` fallback to show a placeholder if image not found

---

## 6. PDF Export — pdfExporter.ts

**Approach:** Uses **jsPDF directly** to draw every element programmatically on the PDF canvas. No html2canvas screenshot is used.

**Why this approach?**
- html2canvas was tried first but had major issues: text alignment broke, fonts changed, paddings were ignored
- jsPDF drawing gives 100% pixel-perfect control over every coordinate

**How it works step by step:**

### Step 1 — loadImageAsBase64()
```
Image path (/photos/member1.png)
  → Convert to absolute URL (window.location.origin + path)
  → Load into HTML Image element
  → Draw onto hidden canvas
  → Export as base64 PNG string
```
This is needed because jsPDF requires base64 image data, not file paths.

### Step 2 — downloadPDF()
```
1. Create jsPDF instance (A4, portrait, pt units)
2. Set y coordinate starting at 40pt from top
3. Draw title (centered using getTextWidth)
4. Draw SDGs (centered)
5. Draw horizontal divider line
6. Draw "Group Members" heading
7. Load all member photos as base64
8. Draw photo row rectangles + embed images
9. Draw name row rectangles + draw centered names
10. Load supervisor photos as base64
11. Draw supervisor boxes with:
    - Horizontal line below heading
    - Vertical line between text and photo columns
    - Text content on left
    - Photo on right
12. Draw abstract text (split into lines with splitTextToSize)
13. Load and draw diagram image
14. Save PDF file
```

**Key coordinate math:**
- Everything positioned with `x, y` in points
- `y` increments after each section
- Images centered: `imgX = cellX + (cellWidth - imgWidth) / 2`
- Names centered: `textX = cellX + (cellWidth - textWidth) / 2`

---

## 7. Word Export — wordExporter.ts

**Approach:** Uses the **`docx` library** to build a real `.docx` file with proper XML structure — fully editable in Microsoft Word.

**Why not html2canvas for Word?**
- `.doc` HTML files with embedded images show blank pages in Word
- Only real `.docx` format works reliably across Word and Google Docs

**How it works:**

### Step 1 — loadImageAsArrayBuffer()
```
Image path → absolute URL → HTML canvas → PNG blob → ArrayBuffer
```
The `docx` library requires ArrayBuffer format for images, not base64.

### Step 2 — Build Tables

**Members table:**
```
Table (CONTENT_WIDTH DXA)
  ├── Row 1 (photo row, 1500 DXA height)
  │     ├── Cell 1: member photo (ImageRun)
  │     ├── Cell 2: member photo
  │     └── Cell 3: member photo
  └── Row 2 (name row, 400 DXA height)
        ├── Cell 1: member name (centered TextRun)
        ├── Cell 2: member name
        └── Cell 3: member name
```

**Supervisors table:**
```
Table (CONTENT_WIDTH DXA)
  └── Row 1
        ├── Cell 1 (Supervisor):
        │     Heading paragraph with border-bottom
        │     Inner Table:
        │       ├── Text cell (65%): name, degree, discipline, specialization
        │       └── Photo cell (35%): ImageRun with border-left
        └── Cell 2 (Co-Supervisor): same structure
```

### Step 3 — Build Document
```
Document
  └── Section (A4 page, 720 DXA margins)
        ├── Title paragraph (centered, bold, 32pt)
        ├── SDG paragraphs (centered)
        ├── Divider (paragraph with border-bottom)
        ├── "Group Members" heading
        ├── Members table
        ├── Supervisors table
        ├── "Abstract" heading
        ├── Abstract paragraph (justified)
        ├── "Diagram" heading
        └── Diagram image paragraph
```

### Step 4 — Save
```
Packer.toBlob(doc) → file-saver saveAs() → project-document.docx
```

---

## 8. Key Design Decisions & Challenges

### Challenge 1: html2canvas text alignment
**Problem:** html2canvas ignored `padding`, `verticalAlign`, and `lineHeight` on `<td>` elements — names appeared stuck to the bottom border.

**Solution:** Switched to jsPDF direct drawing where we mathematically calculate exact coordinates. No CSS interpretation needed.

### Challenge 2: Active/inactive members
**Problem:** When a member is set inactive, the remaining members should fill the full width equally.

**Solution:** `activeMembers.filter(m => m.active)` then `colW = contentW / activeMembers.length`. Both the web component and PDF/Word exporters use this same filter.

### Challenge 3: Word file showing blank
**Problem:** Embedding base64 PNG in `.doc` HTML format showed blank pages in both Word and Google Docs.

**Solution:** Used the `docx` library to generate proper `.docx` XML format with real `ImageRun` elements and correct ArrayBuffer image data.

### Challenge 4: Images not loading
**Problem:** Relative paths like `/photos/member1.png` failed in canvas image loading.

**Solution:** `window.location.origin + src` converts to absolute URL `http://localhost:3000/photos/member1.png` which loads correctly.

### Challenge 5: PDF image overflow
**Problem:** Supervisor photos were overflowing below the box border.

**Solution:** `imgY = headingBottomY + (availableHeight - imgHeight) / 2` — centers the image in the space below the heading line, guaranteeing it never exceeds the box height.

---

## 9. Data Flow Diagram

```
dummyData.ts
     │
     ├──► Document.tsx (web preview)
     │         ├── GroupMembers.tsx
     │         ├── Supervisors.tsx
     │         ├── Abstract.tsx
     │         └── Diagram.tsx
     │
     ├──► pdfExporter.ts
     │         ├── loadImageAsBase64() for each photo
     │         ├── jsPDF draws all elements
     │         └── pdf.save() → browser download
     │
     └──► wordExporter.ts
               ├── loadImageAsArrayBuffer() for each photo
               ├── docx builds tables + paragraphs
               └── Packer.toBlob() → saveAs() → browser download
```

---

## 10. How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
http://localhost:3000
```

**To add/change members:** Edit `data/dummyData.ts`
- Set `active: false` to hide a member
- Change `photo` path to point to a file in `public/photos/`

**To add photos:** Place image files in `public/photos/` folder with names matching `dummyData.ts`

---

## 11. Summary for Demo

> "This project is a Next.js document generator that dynamically renders an academic project poster from a data file. The web preview uses React components with inline styles. When the user clicks Download PDF, jsPDF draws every element — text, tables, images — at exact coordinates. When the user clicks Download Word, the docx library builds a proper XML-based Word document with editable text, real tables, and embedded images. The key challenge was ensuring the exported files look identical to the web preview — which we solved by moving away from screenshot-based approaches to direct programmatic document generation."
