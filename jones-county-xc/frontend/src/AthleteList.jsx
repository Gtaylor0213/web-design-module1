import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import AthleteCard from "./AthleteCard"

function AthleteList() {
  const { data: athletes, isLoading, error, refetch } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const res = await fetch("/api/athletes")
      if (!res.ok) throw new Error("Failed to fetch athletes")
      return res.json()
    },
  })

  if (isLoading)
    return (
      <div className="mt-8 w-full max-w-4xl mx-auto px-4" role="status">
        <Skeleton className="h-8 w-40 mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-4 w-28 mb-3" />
              <Skeleton className="h-9 w-full rounded-md" />
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

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto px-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-5 text-left">Athletes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map((a) => (
          <AthleteCard key={a.Name} name={a.Name} grade={a.Grade} time={a.PersonalRecord} />
        ))}
      </div>
    </div>
  )
}

export default AthleteList
