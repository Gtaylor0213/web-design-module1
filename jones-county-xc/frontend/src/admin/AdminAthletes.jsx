import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
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

const emptyAthlete = { Name: "", Grade: "", PersonalRecord: "", Events: "" }

function AdminAthletes() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyAthlete)
  const [error, setError] = useState("")

  const { data: athletes, isLoading } = useQuery({
    queryKey: ["athletes"],
    queryFn: async () => {
      const res = await fetch("/api/athletes")
      if (!res.ok) throw new Error("Failed to fetch athletes")
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = editing
        ? `/api/admin/athletes/${editing.ID}`
        : "/api/admin/athletes"
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          Grade: parseInt(data.Grade, 10),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save athlete")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] })
      toast.success(editing ? "Athlete updated" : "Athlete added")
      closeDialog()
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/athletes/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to delete athlete")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] })
      toast.success("Athlete deleted")
      setDeleteDialogOpen(false)
      setDeleting(null)
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  function openAdd() {
    setEditing(null)
    setForm(emptyAthlete)
    setError("")
    setDialogOpen(true)
  }

  function openEdit(athlete) {
    setEditing(athlete)
    setForm({
      Name: athlete.Name,
      Grade: String(athlete.Grade),
      PersonalRecord: athlete.PersonalRecord,
      Events: athlete.Events,
    })
    setError("")
    setDialogOpen(true)
  }

  function openDelete(athlete) {
    setDeleting(athlete)
    setError("")
    setDeleteDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
    setForm(emptyAthlete)
    setError("")
  }

  function handleSubmit(e) {
    e.preventDefault()
    saveMutation.mutate(form)
  }

  if (isLoading)
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Athletes</h2>
        <Button onClick={openAdd} className="cursor-pointer">Add Athlete</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Grade</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">PR</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Events</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes && athletes.length > 0 ? (
              athletes.map((a) => (
                <tr key={a.ID} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{a.Name}</td>
                  <td className="px-4 py-3 text-sm">{a.Grade}</td>
                  <td className="px-4 py-3 text-sm">{a.PersonalRecord}</td>
                  <td className="px-4 py-3 text-sm">{a.Events}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(a)} className="cursor-pointer mr-1">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDelete(a)} className="cursor-pointer text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No athletes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Athlete" : "Add Athlete"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update athlete details." : "Enter details for the new athlete."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="athlete-name">Name</Label>
              <Input
                id="athlete-name"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="athlete-grade">Grade</Label>
              <Input
                id="athlete-grade"
                type="number"
                min="9"
                max="12"
                value={form.Grade}
                onChange={(e) => setForm({ ...form, Grade: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="athlete-pr">Personal Record</Label>
              <Input
                id="athlete-pr"
                value={form.PersonalRecord}
                onChange={(e) => setForm({ ...form, PersonalRecord: e.target.value })}
                placeholder="e.g. 17:42"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="athlete-events">Events</Label>
              <Input
                id="athlete-events"
                value={form.Events}
                onChange={(e) => setForm({ ...form, Events: e.target.value })}
                placeholder="e.g. 5K, 3200m"
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
            <DialogTitle>Delete Athlete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleting?.Name}? This cannot be undone.
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

export default AdminAthletes
