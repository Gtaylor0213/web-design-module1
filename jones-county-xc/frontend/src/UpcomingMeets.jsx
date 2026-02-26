import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

function UpcomingMeets() {
  const { data: meets, isLoading, error, refetch } = useQuery({
    queryKey: ["upcomingMeets"],
    queryFn: async () => {
      const res = await fetch("/api/meets/upcoming")
      if (!res.ok) throw new Error("Failed to fetch meets")
      return res.json()
    },
  })

  if (isLoading)
    return (
      <div className="mt-8 w-full max-w-4xl mx-auto px-4" role="status">
        <Skeleton className="h-8 w-48 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <Skeleton className="h-5 w-40 mb-3" />
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-4 w-44" />
            </div>
          ))}
        </div>
      </div>
    )
  if (error)
    return (
      <div className="mt-8 text-center" role="alert">
        <p className="text-red-600">Error: {error.message}</p>
        <Button variant="default" className="mt-3 cursor-pointer" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  if (!meets || meets.length === 0) return <p className="text-gray-500 mt-8 text-center">No upcoming meets.</p>

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-5 text-left">Upcoming Meets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meets.map((meet) => (
          <button
            key={meet.ID}
            onClick={() => alert(`Details for "${meet.Name}" coming soon!`)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-green-400 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <h3 className="font-bold text-gray-900 mb-2">{meet.Name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(meet.Date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
              <svg className="w-4 h-4 text-green-600 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {meet.Location}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
