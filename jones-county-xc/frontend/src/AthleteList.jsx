import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import AthleteCard from "./AthleteCard"

function AthleteList() {
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const { data: athletes, isLoading, error, refetch } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const res = await fetch("/api/athletes")
      if (!res.ok) throw new Error("Failed to fetch athletes")
      return res.json()
    },
  })

  const { data: athleteResults, isLoading: resultsLoading } = useQuery({
    queryKey: ["athleteResults", selectedAthlete?.ID],
    queryFn: async () => {
      const res = await fetch(`/api/athletes/${selectedAthlete.ID}/results`)
      if (!res.ok) throw new Error("Failed to fetch results")
      return res.json()
    },
    enabled: !!selectedAthlete,
  })

  const filteredAndSorted = useMemo(() => {
    if (!athletes) return []

    let result = [...athletes]

    // Filter by team
    if (teamFilter !== "all") {
      result = result.filter((a) => a.Team === teamFilter)
    }

    // Search across name, grade, gender, events, PR
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((a) =>
        a.Name.toLowerCase().includes(q) ||
        String(a.Grade).includes(q) ||
        (a.Gender && a.Gender.toLowerCase().includes(q)) ||
        (a.Events && a.Events.toLowerCase().includes(q)) ||
        (a.PersonalRecord && a.PersonalRecord.includes(q))
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") {
        const lastA = a.Name.split(" ").pop().toLowerCase()
        const lastB = b.Name.split(" ").pop().toLowerCase()
        return lastA.localeCompare(lastB)
      }
      if (sortBy === "grade") {
        return a.Grade - b.Grade
      }
      if (sortBy === "pr") {
        const toSeconds = (t) => {
          const parts = t.split(":")
          return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
        return toSeconds(a.PersonalRecord) - toSeconds(b.PersonalRecord)
      }
      return 0
    })

    return result
  }, [athletes, searchQuery, teamFilter, sortBy])

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

      {/* Search, Filter, Sort toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search athletes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger className="w-full sm:w-44 cursor-pointer">
            <SelectValue placeholder="All Teams" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="Boys Varsity">Boys Varsity</SelectItem>
            <SelectItem value="Girls Varsity">Girls Varsity</SelectItem>
            <SelectItem value="JV Boys">JV Boys</SelectItem>
            <SelectItem value="JV Girls">JV Girls</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-40 cursor-pointer">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Last Name</SelectItem>
            <SelectItem value="grade">Grade</SelectItem>
            <SelectItem value="pr">PR (fastest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSorted.length > 0 ? (
          filteredAndSorted.map((a) => (
            <AthleteCard
              key={a.ID}
              name={a.Name}
              grade={a.Grade}
              time={a.PersonalRecord}
              events={a.Events}
              gender={a.Gender}
              team={a.Team}
              onViewDetails={() => setSelectedAthlete(a)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No athletes match your search.
          </div>
        )}
      </div>

      {/* Athlete Detail Dialog */}
      <Dialog open={!!selectedAthlete} onOpenChange={(open) => { if (!open) setSelectedAthlete(null) }}>
        <DialogContent className="max-w-lg">
          {selectedAthlete && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedAthlete.Name}</DialogTitle>
                <DialogDescription>Athlete profile and race history</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Athlete Info */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAthlete.Grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Personal Record</p>
                    <p className="text-sm font-semibold text-green-600">{selectedAthlete.PersonalRecord}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAthlete.Gender || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Team</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAthlete.Team || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Events</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedAthlete.Events}</p>
                  </div>
                </div>

                {/* Race History */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Race History</h3>
                  {resultsLoading ? (
                    <div className="space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : athleteResults && athleteResults.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-green-600 text-white">
                          <tr>
                            <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Meet</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Event</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Place</th>
                            <th className="text-left px-3 py-2 text-xs font-semibold uppercase">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {athleteResults.map((r) => (
                            <tr key={r.ID} className="border-t border-gray-100 hover:bg-green-50/50 transition-colors">
                              <td className="px-3 py-2 text-sm">
                                <div>{r.MeetName}</div>
                                <div className="text-xs text-gray-400">
                                  {new Date(r.MeetDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-sm">{r.Event}</td>
                              <td className="px-3 py-2 text-sm font-semibold">{r.Place}</td>
                              <td className="px-3 py-2 text-sm font-semibold text-green-600">{r.Time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No race results yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AthleteList
