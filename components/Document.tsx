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
        minHeight: "1123px",
        backgroundColor: "#ffffff",
        padding: "40px 50px",
        margin: "0 auto",
        boxSizing: "border-box",
        fontFamily: "Times New Roman, serif",
        fontSize: "12px",
        color: "#000000"
      }}
    >

      {/* Title + SDGs */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: "Times New Roman, serif",
          textAlign: "center",
          margin: "0 0 6px 0"
        }}>
          {projectData.title}
        </p>
        {projectData.sdgs.map((sdg, index) => (
          <p
            key={index}
            style={{
              fontSize: "13px",
                        textAlign: "center",
              fontFamily: "Times New Roman, serif",
              margin: "0 0 2px 0"
            }}
          >
            {sdg}
          </p>
        ))}
      </div>

      {/* Divider Line */}
      <hr style={{
        border: "none",
        borderTop: "1px solid #000",
        marginBottom: "16px"
      }} />

      {/* Group Members */}
      <GroupMembers members={projectData.groupMembers} />

      {/* Supervisors */}
      <Supervisors
        supervisor={projectData.supervisor}
        coSupervisor={projectData.coSupervisor}
      />

      {/* Abstract */}
      <Abstract text={projectData.abstract} />

      {/* Diagram */}
      <Diagram imagePath={projectData.diagram} />

    </div>
  )
})

Document.displayName = "Document"

export default Document