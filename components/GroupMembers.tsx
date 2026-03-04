/* eslint-disable @next/next/no-img-element */
import { Member } from "@/data/dummyData"

interface GroupMembersProps {
  members: Member[]
}

export default function GroupMembers({ members }: GroupMembersProps) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <p style={{
        fontWeight: "bold",
        fontSize: "12px",
        margin: "0 0 6px 0",
        fontFamily: "Times New Roman, serif",
        textAlign: "left"
      }}>
        Group Members
      </p>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        border: "1px solid #000"
      }}>
        <tbody>

          {/* Photo Row */}
          <tr>
            {members.map((member) => (
              <td
                key={`photo-${member.id}`}
                style={{
                  width: "25%",
                  height: "130px",
                  border: "1px solid #000",
                  textAlign: "center",
                  verticalAlign: "middle",
                  padding: "10px 4px"
                }}
              >
                {member.active && (
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{
                      width: "80px",
                      height: "100px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto"
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='65' height='85'%3E%3Crect width='65' height='85' fill='%23e5e7eb'/%3E%3Ccircle cx='32' cy='28' r='16' fill='%239ca3af'/%3E%3Cellipse cx='32' cy='70' rx='22' ry='18' fill='%239ca3af'/%3E%3C/svg%3E`
                    }}
                  />
                )}
              </td>
            ))}
          </tr>

          {/* Name Row — inner table for guaranteed centering in html2canvas */}
          <tr>
            {members.map((member) => (
              <td
                key={`name-${member.id}`}
                style={{
                  width: "25%",
                  border: "1px solid #000",
                  padding: "0",
                  margin: "0"
                }}
              >
                <table style={{
                  width: "100%",
                  height: "36px",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                  border: "none"
                }}>
                  <tbody>
                    <tr style={{ height: "36px" }}>
                      <td style={{
                        height: "36px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontFamily: "Times New Roman, serif",
                        fontSize: "10px",
                        color: "#000000",
                        padding: "0",
                        border: "none"
                      }}>
                        {member.active ? member.name : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            ))}
          </tr>

        </tbody>
      </table>
    </div>
  )
}