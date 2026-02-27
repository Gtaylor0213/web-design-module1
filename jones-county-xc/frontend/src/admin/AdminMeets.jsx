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

const emptyMeet = { Name: "", Date: "", Location: "", Description: "" }

function AdminMeets() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyMeet)
  const [error, setError] = useState("")

  const { data: meets, isLoading } = useQuery({
    queryKey: ["allMeets"],
    queryFn: async () => {
      const res = await fetch("/api/meets")
      if (!res.ok) throw new Error("Failed to fetch meets")
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const url = editing
        ? `/api/admin/meets/${editing.ID}`
        : "/api/admin/meets"
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save meet")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allMeets"] })
      queryClient.invalidateQueries({ queryKey: ["upcomingMeets"] })
      toast.success(editing ? "Meet updated" : "Meet added")
      closeDialog()
    },
    onError: (err) => {
      setError(err.message)
      toast.error(err.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/meets/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to delete meet")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allMeets"] })
      queryClient.invalidateQueries({ queryKey: ["upcomingMeets"] })
      toast.success("Meet deleted")
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
    setForm(emptyMeet)
    setError("")
    setDialogOpen(true)
  }

  function openEdit(meet) {
    setEditing(meet)
    setForm({
      Name: meet.Name,
      Date: meet.Date ? meet.Date.split("T")[0] : "",
      Location: meet.Location,
      Description: meet.Description,
    })
    setError("")
    setDialogOpen(true)
  }

  function openDelete(meet) {
    setDeleting(meet)
    setError("")
    setDeleteDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setEditing(null)
    setForm(emptyMeet)
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
        <h2 className="text-xl font-bold text-gray-900">Meets</h2>
        <Button onClick={openAdd} className="cursor-pointer">Add Meet</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Location</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meets && meets.length > 0 ? (
              meets.map((m) => (
                <tr key={m.ID} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm">{m.Name}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(m.Date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">{m.Location}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(m)} className="cursor-pointer mr-1">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDelete(m)} className="cursor-pointer text-red-600 hover:text-red-700">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No meets found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Meet" : "Add Meet"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update meet details." : "Enter details for the new meet."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="meet-name">Name</Label>
              <Input
                id="meet-name"
                value={form.Name}
                onChange={(e) => setForm({ ...form, Name: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="meet-date">Date</Label>
              <Input
                id="meet-date"
                type="date"
                value={form.Date}
                onChange={(e) => setForm({ ...form, Date: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="meet-location">Location</Label>
              <Input
                id="meet-location"
                value={form.Location}
                onChange={(e) => setForm({ ...form, Location: e.target.value })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="meet-description">Description</Label>
              <Input
                id="meet-description"
                value={form.Description}
                onChange={(e) => setForm({ ...form, Description: e.target.value })}
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
            <DialogTitle>Delete Meet</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleting?.Name}&quot;? This cannot be undone.
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

export default AdminMeets
