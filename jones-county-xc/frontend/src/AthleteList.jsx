import { useQuery } from "@tanstack/react-query"
import AthleteCard from "./AthleteCard"

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
    <div className="mt-8 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Athletes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map((a) => (
          <AthleteCard key={a.Name} name={a.Name} grade={a.Grade} time={a.PersonalRecord} />
        ))}
      </div>
    </div>
  )
}

export default AthleteList
