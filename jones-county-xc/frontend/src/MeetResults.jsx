import { useQuery } from "@tanstack/react-query"

function MeetResults({ meetId, meetName }) {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["meetResults", meetId],
    queryFn: async () => {
      const res = await fetch(`/api/meets/${meetId}/results`)
      if (!res.ok) throw new Error("Failed to fetch results")
      return res.json()
    },
  })

  if (isLoading) return <p className="text-gray-500 mt-4">Loading results...</p>
  if (error) return <p className="text-red-600 mt-4">Error: {error.message}</p>
  if (!results || results.length === 0) return <p className="text-gray-500 mt-4">No results yet.</p>

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results — {meetName}</h2>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-2">Place</th>
            <th className="text-left px-4 py-2">Athlete</th>
            <th className="text-left px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.ID} className="border-t">
              <td className="px-4 py-2">{r.Place}</td>
              <td className="px-4 py-2">{r.AthleteName}</td>
              <td className="px-4 py-2">{r.Time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MeetResults
