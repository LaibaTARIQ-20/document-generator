/* eslint-disable @next/next/no-img-element */
import { Supervisor } from "@/data/dummyData"

interface SupervisorsProps {
  supervisor: Supervisor
  coSupervisor: Supervisor
}

export default function Supervisors({
  supervisor,
  coSupervisor
}: SupervisorsProps) {
  return (
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      tableLayout: "fixed",
      marginBottom: "8px",
      border: "1px solid #000"
    }}>
      <tbody>
        <tr>

          {/* LEFT — Supervisor */}
          <td style={{
            width: "50%",
            border: "1px solid #000",
            verticalAlign: "top",
            padding: "0"
          }}>
            {/* Heading row */}
            <div style={{
              borderBottom: "1px solid #000",
              padding: "4px 6px",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "Times New Roman, serif"
            }}>
              Project Supervisor
            </div>

            {/* Content: text | photo */}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              margin: "0"
            }}>
              <tbody>
                <tr>
                  {/* Text column */}
                  <td style={{
                    width: "65%",
                    verticalAlign: "top",
                    padding: "6px",
                    borderRight: "1px solid #000"
                  }}>
                    {supervisor.active && (
                      <>
                        <p style={{
                          fontWeight: "bold",
                          fontSize: "10px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          {supervisor.name}
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          {supervisor.degree} ({supervisor.university})
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          <strong>Discipline:</strong> {supervisor.discipline}
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          <strong>Specialization:</strong> {supervisor.specialization}
                        </p>
                      </>
                    )}
                  </td>

                  {/* Photo column */}
                  <td style={{
                    width: "35%",
                    verticalAlign: "middle",
                    textAlign: "center",
                    padding: "6px"
                  }}>
                    {supervisor.active && (
                      <img
                        src={supervisor.photo}
                        alt={supervisor.name}
                        style={{
                          width: "70px",
                          height: "80px",
                          objectFit: "cover",
                          display: "block",
                          margin: "0 auto"
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='80'%3E%3Crect width='70' height='80' fill='%23e5e7eb'/%3E%3Ccircle cx='35' cy='27' r='17' fill='%239ca3af'/%3E%3Cellipse cx='35' cy='65' rx='24' ry='18' fill='%239ca3af'/%3E%3C/svg%3E`
                        }}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

          {/* RIGHT — Co-Supervisor */}
          <td style={{
            width: "50%",
            border: "1px solid #000",
            verticalAlign: "top",
            padding: "0"
          }}>
            {/* Heading row */}
            <div style={{
              borderBottom: "1px solid #000",
              padding: "4px 6px",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "Times New Roman, serif"
            }}>
              Project Co-Supervisor
            </div>

            {/* Content: text | photo */}
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
              margin: "0"
            }}>
              <tbody>
                <tr>
                  {/* Text column */}
                  <td style={{
                    width: "65%",
                    verticalAlign: "top",
                    padding: "6px",
                    borderRight: "1px solid #000"
                  }}>
                    {coSupervisor.active && (
                      <>
                        <p style={{
                          fontWeight: "bold",
                          fontSize: "10px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          {coSupervisor.name}
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          {coSupervisor.degree} ({coSupervisor.university})
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0 0 3px 0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          <strong>Discipline:</strong> {coSupervisor.discipline}
                        </p>
                        <p style={{
                          fontSize: "9px",
                          margin: "0",
                          fontFamily: "Times New Roman, serif"
                        }}>
                          <strong>Specialization:</strong> {coSupervisor.specialization}
                        </p>
                      </>
                    )}
                  </td>

                  {/* Photo column */}
                  <td style={{
                    width: "35%",
                    verticalAlign: "middle",
                    textAlign: "center",
                    padding: "6px"
                  }}>
                    {coSupervisor.active && (
                      <img
                        src={coSupervisor.photo}
                        alt={coSupervisor.name}
                        style={{
                          width: "70px",
                          height: "80px",
                          objectFit: "cover",
                          display: "block",
                          margin: "0 auto"
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='80'%3E%3Crect width='70' height='80' fill='%23e5e7eb'/%3E%3Ccircle cx='35' cy='27' r='17' fill='%239ca3af'/%3E%3Cellipse cx='35' cy='65' rx='24' ry='18' fill='%239ca3af'/%3E%3C/svg%3E`
                        }}
                      />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>

        </tr>
      </tbody>
    </table>
  )
}