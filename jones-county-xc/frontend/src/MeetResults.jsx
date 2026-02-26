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

  if (isLoading) return <p className="text-gray-500 mt-4" role="status">Loading results...</p>
  if (error) return <p className="text-red-600 mt-4" role="alert">Error: {error.message}</p>
  if (!results || results.length === 0) return <p className="text-gray-500 mt-4">No results yet.</p>

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Results — {meetName}</h2>
      <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
        <caption className="sr-only">Race results for {meetName}</caption>
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Place</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Athlete</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.ID} className="border-t border-gray-100 hover:bg-green-50/50 transition-colors">
              <td className="px-4 py-3 text-sm">{r.Place}</td>
              <td className="px-4 py-3 text-sm">{r.AthleteName}</td>
              <td className="px-4 py-3 text-sm">{r.Time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MeetResults
