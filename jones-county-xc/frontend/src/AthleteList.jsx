import { useQuery } from "@tanstack/react-query"

function AthleteList() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const res = await fetch("/api/athletes")
      if (!res.ok) throw new Error("Failed to fetch athletes")
      return res.json()
    },
  })

  if (isLoading) return <p className="text-gray-500 mt-8">Loading athletes...</p>
  if (error) return <p className="text-red-600 mt-8">Error: {error.message}</p>

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Athletes</h2>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Grade</th>
            <th className="text-left px-4 py-2">PR</th>
          </tr>
        </thead>
        <tbody>
          {athletes.map((a) => (
            <tr key={a.name} className="border-t">
              <td className="px-4 py-2">{a.name}</td>
              <td className="px-4 py-2">{a.grade}</td>
              <td className="px-4 py-2">{a.personalRecord}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AthleteList
