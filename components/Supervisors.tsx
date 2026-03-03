/* eslint-disable @next/next/no-img-element */
import { Supervisor } from "@/data/dummyData"

interface SupervisorsProps {
  supervisor: Supervisor
  coSupervisor: Supervisor
}

export default function Supervisors({ supervisor, coSupervisor }: SupervisorsProps) {
  return (
    <div style={{ marginBottom: "12px" }}>

      {/* Table — always 2 fixed cells */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed"
      }}>
        <tbody>
          <tr>

            {/* LEFT CELL — Project Supervisor */}
            <td style={{
              width: "50%",
              border: "1px solid #000",
              verticalAlign: "top",
              padding: "6px"
            }}>
              {/* Heading always shows */}
              <p style={{
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "6px",
                fontFamily: "Times New Roman, serif"
              }}>
                Project Supervisor
              </p>

              {/* Content only shows if active */}
              {supervisor.active && (
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <tbody>
                    <tr>

                      {/* Supervisor Text Info */}
                      <td style={{
                        verticalAlign: "top",
                        paddingRight: "6px",
                        width: "65%"
                      }}>
                        <p style={{
                          fontWeight: "bold",
                          fontSize: "11px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 3px 0"
                        }}>
                          {supervisor.name}
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 2px 0"
                        }}>
                          {supervisor.degree} ({supervisor.university})
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 2px 0"
                        }}>
                          <span style={{ fontWeight: "bold" }}>Discipline: </span>
                          {supervisor.discipline}
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0"
                        }}>
                          <span style={{ fontWeight: "bold" }}>Specialization: </span>
                          {supervisor.specialization}
                        </p>
                      </td>

                      {/* Supervisor Photo */}
                      <td style={{
                        verticalAlign: "top",
                        width: "35%",
                        textAlign: "center"
                      }}>
                        <img
                          src={supervisor.photo}
                          alt={supervisor.name}
                          style={{
                            width: "70px",
                            height: "80px",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='80'%3E%3Crect width='70' height='80' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10'%3EPhoto%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      </td>

                    </tr>
                  </tbody>
                </table>
              )}
            </td>

            {/* RIGHT CELL — Project Co-Supervisor */}
            <td style={{
              width: "50%",
              border: "1px solid #000",
              verticalAlign: "top",
              padding: "6px"
            }}>
              {/* Heading always shows */}
              <p style={{
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "6px",
                fontFamily: "Times New Roman, serif"
              }}>
                Project Co-Supervisor
              </p>

              {/* Content only shows if active */}
              {coSupervisor.active && (
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}>
                  <tbody>
                    <tr>

                      {/* Co-Supervisor Text Info */}
                      <td style={{
                        verticalAlign: "top",
                        paddingRight: "6px",
                        width: "65%"
                      }}>
                        <p style={{
                          fontWeight: "bold",
                          fontSize: "11px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 3px 0"
                        }}>
                          {coSupervisor.name}
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 2px 0"
                        }}>
                          {coSupervisor.degree} ({coSupervisor.university})
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0 0 2px 0"
                        }}>
                          <span style={{ fontWeight: "bold" }}>Discipline: </span>
                          {coSupervisor.discipline}
                        </p>
                        <p style={{
                          fontSize: "10px",
                          fontFamily: "Times New Roman, serif",
                          margin: "0"
                        }}>
                          <span style={{ fontWeight: "bold" }}>Specialization: </span>
                          {coSupervisor.specialization}
                        </p>
                      </td>

                      {/* Co-Supervisor Photo */}
                      <td style={{
                        verticalAlign: "top",
                        width: "35%",
                        textAlign: "center"
                      }}>
                        <img
                          src={coSupervisor.photo}
                          alt={coSupervisor.name}
                          style={{
                            width: "70px",
                            height: "80px",
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='80'%3E%3Crect width='70' height='80' fill='%23cccccc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='10'%3EPhoto%3C/text%3E%3C/svg%3E"
                          }}
                        />
                      </td>

                    </tr>
                  </tbody>
                </table>
              )}
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  )
}
