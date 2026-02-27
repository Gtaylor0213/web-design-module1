import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import AdminAthletes from "@/admin/AdminAthletes"
import AdminMeets from "@/admin/AdminMeets"
import AdminResults from "@/admin/AdminResults"

const tabs = [
  { id: "athletes", label: "Athletes" },
  { id: "meets", label: "Meets" },
  { id: "results", label: "Results" },
]

function AdminDashboard({ onLogout }) {
  const [subTab, setSubTab] = useState("athletes")
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
    onLogout()
  }

  return (
    <div className="py-10 animate-fade-in">
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
            Admin Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout} className="cursor-pointer">
            Logout
          </Button>
        </div>
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <Button
              key={t.id}
              variant={subTab === t.id ? "default" : "outline"}
              onClick={() => setSubTab(t.id)}
              className="cursor-pointer"
            >
              {t.label}
            </Button>
          ))}
        </div>
        {subTab === "athletes" && <AdminAthletes />}
        {subTab === "meets" && <AdminMeets />}
        {subTab === "results" && <AdminResults />}
      </div>
    </div>
  )
}

export default AdminDashboard
