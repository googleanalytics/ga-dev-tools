import Spinner from "@/components/Spinner"
import React from "react"
import useAllAPS from "./useAllAPS"

interface ExploreTableProps {}

const ExploreTable: React.FC<ExploreTableProps> = () => {
  const aps = useAllAPS()

  if (aps === undefined) {
    return <Spinner ellipses>Loading accounts</Spinner>
  }
  return (
    <table>
      <tbody>
        {aps.map((aps, aIdx) =>
          aps.propertySummaries.flatMap((pws, pIdx) => [
            pws.iosStreams === undefined ||
            pws.webStreams === undefined ||
            pws.androidStreams === undefined
              ? [
                  <tr key={`${aIdx}${pIdx}-loading`}>
                    <td>{aps.displayName}</td>
                    <td>{pws.displayName}</td>
                    <td>
                      <Spinner>Loading streams</Spinner>
                    </td>
                  </tr>,
                ]
              : [
                  pws.webStreams.map((s, sIdx) => (
                    <tr key={`${aIdx}-${pIdx}-${sIdx}-web`}>
                      <td>{aps.displayName}</td>
                      <td>{pws.displayName}</td>
                      <td>{s.displayName}</td>
                    </tr>
                  )),
                  pws.androidStreams.map((s, sIdx) => (
                    <tr key={`${aIdx}-${pIdx}-${sIdx}-android`}>
                      <td>{aps.displayName}</td>
                      <td>{pws.displayName}</td>
                      <td>{s.displayName}</td>
                    </tr>
                  )),
                  pws.iosStreams.map((s, sIdx) => (
                    <tr key={`${aIdx}-${pIdx}-${sIdx}-ios`}>
                      <td>{aps.displayName}</td>
                      <td>{pws.displayName}</td>
                      <td>{s.displayName}</td>
                    </tr>
                  )),
                ],
          ])
        )}
      </tbody>
    </table>
  )
}

export default ExploreTable
