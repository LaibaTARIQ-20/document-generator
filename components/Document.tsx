"use client"

import { forwardRef } from "react"
import projectData from "@/data/dummyData"
import GroupMembers from "./GroupMembers"
import Supervisors from "./Supervisors"
import Abstract from "./Abstract"
import Diagram from "./Diagram"

const Document = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      id="document"
      style={{
        width: "794px",
        backgroundColor: "#ffffff",
        padding: "30px 40px 40px 40px",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "Times New Roman, serif",
        fontSize: "12px",
        color: "#000000"
      }}
    >

      {/* ── TITLE + SDGs ── */}
      <div style={{ marginBottom: "10px" }}>
        <p style={{
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Times New Roman, serif",
          textAlign: "center",
          margin: "0 0 4px 0"
        }}>
          {projectData.title}
        </p>
        {projectData.sdgs.map((sdg, index) => (
          <p
            key={index}
            style={{
              fontSize: "12px",
              textAlign: "center",
              fontFamily: "Times New Roman, serif",
              margin: "0"
            }}
          >
            {sdg}
          </p>
        ))}
      </div>

      {/* ── DIVIDER ── */}
      <hr style={{
        border: "none",
        borderTop: "1px solid #000",
        margin: "0 0 14px 0"
      }} />

      {/* ── GROUP MEMBERS ── */}
      {/* marginBottom on GroupMembers div = space before supervisor table */}
      <div style={{ marginBottom: "14px" }}>
        <GroupMembers members={projectData.groupMembers} />
      </div>

      {/* ── SUPERVISORS ── */}
      <div style={{ marginBottom: "14px" }}>
        <Supervisors
          supervisor={projectData.supervisor}
          coSupervisor={projectData.coSupervisor}
        />
      </div>

      {/* ── ABSTRACT ── */}
      <div style={{ marginBottom: "14px" }}>
        <Abstract text={projectData.abstract} />
      </div>

      {/* ── DIAGRAM ── */}
      <Diagram imagePath={projectData.diagram} />

    </div>
  )
})

Document.displayName = "Document"
export default Document