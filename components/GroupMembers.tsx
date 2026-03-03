/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Member } from "@/data/dummyData"
import Image from "next/image"

interface GroupMembersProps {
  members: Member[]
}

export default function GroupMembers({ members }: GroupMembersProps) {
  return (
    <div style={{ marginBottom: "12px" }}>

      {/* Section Heading */}
      <p style={{
        fontWeight: "bold",
        fontSize: "13px",
        marginBottom: "6px",
        fontFamily: "Times New Roman, serif"
      }}>
        Group Members
      </p>

      {/* Table — always 4 fixed cells */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
      }}>
        <tbody>

          {/* Row 1 — Photos */}
          <tr>
            {members.map((member) => (
              <td
                key={member.id}
                style={{
                  width: "25%",
                  height: "120px",
                  border: "1px solid #000",
                  textAlign: "center",
                  verticalAlign: "middle",
                  padding: "4px"
                }}
              >
                {/* Only show content if active, cell stays either way */}
                {member.active && (
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%"
                  }}>
                    <img
                      src={member.photo}
                      alt={member.name}
                      style={{
                        width: "80px",
                        height: "100px",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        // If photo not found, show grey placeholder
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='100'%3E%3Crect width='80' height='100' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10'%3EPhoto%3C/text%3E%3C/svg%3E"
                      }}
                    />
                  </div>
                )}
              </td>
            ))}
          </tr>

          {/* Row 2 — Names */}
          <tr>
            {members.map((member) => (
              <td
                key={member.id}
                style={{
                  width: "25%",
                  height: "24px",
                  border: "1px solid #000",
                  textAlign: "center",
                  verticalAlign: "middle",
                  fontSize: "11px",
                  fontFamily: "Times New Roman, serif",
                  padding: "2px"
                }}
              >
                {/* Only show name if active, cell stays either way */}
                {member.active && member.name}
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  )
}
