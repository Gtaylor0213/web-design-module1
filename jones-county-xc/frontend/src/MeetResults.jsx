import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function MeetResults({ meetId, meetName }) {
  const { data: results, isLoading, error, refetch } = useQuery({
    queryKey: ["meetResults", meetId],
    queryFn: async () => {
      const res = await fetch(`/api/meets/${meetId}/results`)
      if (!res.ok) throw new Error("Failed to fetch results")
      return res.json()
    },
  })

  if (isLoading)
    return (
      <div className="mt-8 w-full max-w-4xl mx-auto px-4" role="status">
        <Skeleton className="h-8 w-64 mb-5" />
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-green-600 px-4 py-3 flex gap-8">
            <Skeleton className="h-4 w-12 bg-green-500" />
            <Skeleton className="h-4 w-20 bg-green-500" />
            <Skeleton className="h-4 w-10 bg-green-500" />
            <Skeleton className="h-4 w-14 bg-green-500" />
            <Skeleton className="h-4 w-12 bg-green-500" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-8 border-t border-gray-100">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  if (error)
    return (
      <div className="mt-4 text-center" role="alert">
        <p className="text-red-600">Error: {error.message}</p>
        <Button variant="default" className="mt-3 cursor-pointer" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  if (!results || results.length === 0) return <p className="text-gray-500 mt-4">No results yet.</p>

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-5">Results — {meetName}</h2>
      <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
        <caption className="sr-only">Race results for {meetName}</caption>
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Place</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Athlete</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Grade</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Event</th>
            <th className="text-left px-4 py-3 text-sm font-semibold tracking-wide uppercase">Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.ID} className="border-t border-gray-100 hover:bg-green-50/50 transition-colors">
              <td className="px-4 py-3 text-sm">{r.Place}</td>
              <td className="px-4 py-3 text-sm">{r.AthleteName}</td>
              <td className="px-4 py-3 text-sm">{r.AthleteGrade}</td>
              <td className="px-4 py-3 text-sm">{r.Event}</td>
              <td className="px-4 py-3 text-sm">{r.Time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MeetResults
