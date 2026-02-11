import { useQuery } from "@tanstack/react-query"

function MeetList() {
  const { data: meets, isLoading, error } = useQuery({
    queryKey: ["meets"],
    queryFn: async () => {
      const res = await fetch("/api/meets")
      if (!res.ok) throw new Error("Failed to fetch meets")
      return res.json()
    },
  })

  if (isLoading) return <p className="text-gray-500 mt-8">Loading meets...</p>
  if (error) return <p className="text-red-600 mt-8">Error: {error.message}</p>

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Meets</h2>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-2">Meet</th>
            <th className="text-left px-4 py-2">Date</th>
            <th className="text-left px-4 py-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {meets.map((m) => (
            <tr key={m.ID} className="border-t">
              <td className="px-4 py-2">{m.Name}</td>
              <td className="px-4 py-2">{new Date(m.Date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{m.Location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MeetList
