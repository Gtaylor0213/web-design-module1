import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const emptyResult = { AthleteID: "", MeetID: "", Time: "", Place: "" }

function AdminResults() {
  const queryClient = useQueryClient()
  const [selectedMeetId, setSelectedMeetId] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyResult)
  const [error, setError] = useState("")

  const { data: meets } = useQuery({
    queryKey: ["allMeets"],
    queryFn: async () => {
      const res = await fetch("/api/meets")
      if (!res.ok) throw new Error("Failed to fetch meets")
      return res.json()
    },
  })

  const { data: athletes } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const res = await fetch("/api/athletes")
      if (!res.ok) throw new Error("Failed to fetch athletes")
      return res.json()
    },
  })

  const { data: results, isLoading: resultsLoading } = useQuery({
    queryKey: ["meetResults", selectedMeetId],
    queryFn: async () => {
      const res = await fetch(`/api/meets/${selectedMeetId}/results`)
      if (!res.ok) throw new Error("Failed to fetch results")
      return res.json()
    },
    enabled: !!selectedMeetId,
  })

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = editing
        ? `/api/admin/results/${editing.ID}`
        : "/api/admin/results"
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          AthleteID: parseInt(data.AthleteID, 10),
          MeetID: parseInt(data.MeetID, 10),
          Time: data.Time,
          Place: parseInt(data.Place, 10),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save result")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetResults", selectedMeetId] })
      closeDialog()
    },
    onError: (err) => setError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/results/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to delete result")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetResults", selectedMeetId] })
      setDeleteDialogOpen(false)
      setDeleting(null)
    },
    onError: (err) => setError(err.message),
  })

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyResult, MeetID: String(selectedMeetId) })
    setError("")
    setDialogOpen(true)
  }

  function openEdit(result) {
    setEditing(result)
    setForm({
      AthleteID: String(result.AthleteID),
      MeetID: String(result.MeetID),
      Time: result.Time,
      Place: String(result.Place),
    })
    setError("")
    setDialogOpen(true)
  }

  function openDelete(result) {
    setDeleting(result)
    setError("")
    setDeleteDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
    setForm(emptyResult)
    setError("")
  }

  function handleSubmit(e) {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Results</h2>
        {selectedMeetId && (
          <Button onClick={openAdd} className="cursor-pointer">Add Result</Button>
        )}
      </div>

      {/* Meet Selector */}
      <div className="mb-4">
        <Label htmlFor="meet-select" className="mb-1 block">Select a meet</Label>
        <select
          id="meet-select"
          value={selectedMeetId || ""}
          onChange={(e) => setSelectedMeetId(e.target.value ? Number(e.target.value) : null)}
          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">-- Choose a meet --</option>
          {meets?.map((m) => (
            <option key={m.ID} value={m.ID}>
              {m.Name} ({new Date(m.Date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
            </option>
          ))}
        </select>
      </div>

      {!selectedMeetId && (
        <p className="text-gray-500 text-sm">Select a meet above to view and manage results.</p>
      )}

      {selectedMeetId && resultsLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {selectedMeetId && !resultsLoading && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Place</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Athlete</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Time</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results && results.length > 0 ? (
                results.map((r) => (
                  <tr key={r.ID} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{r.Place}</td>
                    <td className="px-4 py-3 text-sm">{r.AthleteName}</td>
                    <td className="px-4 py-3 text-sm">{r.Time}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)} className="cursor-pointer mr-1">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => openDelete(r)} className="cursor-pointer text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No results for this meet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Result" : "Add Result"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update result details." : "Enter details for the new result."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="result-athlete">Athlete</Label>
              <select
                id="result-athlete"
                value={form.AthleteID}
                onChange={(e) => setForm({ ...form, AthleteID: e.target.value })}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">-- Select athlete --</option>
                {athletes?.map((a) => (
                  <option key={a.ID} value={a.ID}>{a.Name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="result-place">Place</Label>
              <Input
                id="result-place"
                type="number"
                min="1"
                value={form.Place}
                onChange={(e) => setForm({ ...form, Place: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="result-time">Time</Label>
              <Input
                id="result-time"
                value={form.Time}
                onChange={(e) => setForm({ ...form, Time: e.target.value })}
                placeholder="e.g. 17:42"
                required
                className="mt-1"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} className="cursor-pointer">
                {saveMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Result</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this result? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setDeleteDialogOpen(false); setError("") }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleting?.ID)}
              disabled={deleteMutation.isPending}
              className="cursor-pointer"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminResults
