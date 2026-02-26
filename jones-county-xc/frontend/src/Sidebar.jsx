import { useState, useEffect } from "react"

const navItems = [
  { id: "home", label: "Home" },
  { id: "athletes", label: "Athletes" },
  { id: "meets", label: "Meets" },
  { id: "results", label: "Results" },
]

function Sidebar({ activeTab, onTabChange }) {
  const [open, setOpen] = useState(false)

  // Close mobile menu on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && open) setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-green-900 text-white p-2 rounded-lg shadow-lg cursor-pointer"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Main navigation"
        className={`fixed top-0 left-0 h-full w-64 bg-green-900 text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-green-700">
          <h2 className="font-extrabold text-xl tracking-wider uppercase">JCXC</h2>
          <p className="text-xs text-green-300 mt-1 tracking-wide">Jones County Cross Country</p>
        </div>

        {/* Close button - mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-green-200 hover:text-white cursor-pointer"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="mt-4" role="tablist" aria-label="Site sections">
          {navItems.map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              onClick={() => {
                onTabChange(item.id)
                setOpen(false)
              }}
              className={`w-full text-left px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-green-800 text-white border-l-4 border-yellow-400"
                  : "text-green-200 hover:bg-green-800 hover:text-white border-l-4 border-transparent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
