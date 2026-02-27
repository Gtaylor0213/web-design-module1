import { useState, useEffect } from "react"

const navItems = [
  { id: "home", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  { id: "athletes", label: "Athletes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "meets", label: "Meets", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { id: "results", label: "Results", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
]

const adminIcon = "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
const loginIcon = "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"

function Sidebar({ activeTab, onTabChange, isAuthenticated, collapsed, onToggleCollapse }) {
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
        className={`fixed top-0 left-0 h-full bg-green-900 text-white z-50 transition-all duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ width: open ? "16rem" : (collapsed ? "4rem" : "16rem") }}
      >
        {/* On desktop, control width via a wrapper that transitions */}
        <div className="hidden md:flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: collapsed ? "4rem" : "16rem" }}
        >
          {/* Logo / Brand */}
          <div className={`border-b border-green-700 flex items-center shrink-0 ${collapsed ? "p-3 justify-center" : "p-6 gap-3"}`}>
            <img src="/jc-logo.png" alt="Jones County logo" className={`shrink-0 ${collapsed ? "w-10 h-10" : "w-12 h-12"}`} />
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-extrabold text-xl tracking-wider uppercase">JCXC</h2>
                <p className="text-xs text-green-300 mt-1 tracking-wide whitespace-nowrap">Jones County Cross Country</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-1" role="tablist" aria-label="Site sections">
            {navItems.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeTab === item.id}
                title={collapsed ? item.label : undefined}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                  collapsed ? "justify-center px-0 py-3" : "px-6 py-3"
                } ${
                  activeTab === item.id
                    ? "bg-green-800 text-white border-l-4 border-yellow-400"
                    : "text-green-200 hover:bg-green-800 hover:text-white border-l-4 border-transparent"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom: Login/Admin + Collapse toggle */}
          <div className="border-t border-green-700 shrink-0">
            <button
              role="tab"
              aria-selected={activeTab === (isAuthenticated ? "admin" : "login")}
              title={collapsed ? (isAuthenticated ? "Admin" : "Login") : undefined}
              onClick={() => onTabChange(isAuthenticated ? "admin" : "login")}
              className={`w-full flex items-center gap-3 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                collapsed ? "justify-center px-0 py-3" : "px-6 py-3"
              } ${
                activeTab === "admin" || activeTab === "login"
                  ? "bg-green-800 text-white border-l-4 border-yellow-400"
                  : "text-green-200 hover:bg-green-800 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isAuthenticated ? adminIcon : loginIcon} />
              </svg>
              {!collapsed && <span className="whitespace-nowrap">{isAuthenticated ? "Admin" : "Login"}</span>}
            </button>

            {/* Collapse toggle */}
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center py-3 text-green-300 hover:text-white hover:bg-green-800 transition-colors cursor-pointer border-t border-green-700"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile sidebar content (always expanded) */}
        <div className="md:hidden flex flex-col h-full w-64">
          {/* Logo / Brand */}
          <div className="p-6 border-b border-green-700 flex items-center gap-3">
            <img src="/jc-logo.png" alt="Jones County logo" className="w-12 h-12" />
            <div>
              <h2 className="font-extrabold text-xl tracking-wider uppercase">JCXC</h2>
              <p className="text-xs text-green-300 mt-1 tracking-wide">Jones County Cross Country</p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-green-200 hover:text-white cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation */}
          <nav className="mt-4 flex-1" role="tablist" aria-label="Site sections">
            {navItems.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={activeTab === item.id}
                onClick={() => {
                  onTabChange(item.id)
                  setOpen(false)
                }}
                className={`w-full text-left flex items-center gap-3 px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? "bg-green-800 text-white border-l-4 border-yellow-400"
                    : "text-green-200 hover:bg-green-800 hover:text-white border-l-4 border-transparent"
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Login / Admin link at bottom */}
          <div className="border-t border-green-700">
            <button
              role="tab"
              aria-selected={activeTab === (isAuthenticated ? "admin" : "login")}
              onClick={() => {
                onTabChange(isAuthenticated ? "admin" : "login")
                setOpen(false)
              }}
              className={`w-full text-left flex items-center gap-3 px-6 py-3 text-sm font-medium uppercase tracking-wide transition-colors cursor-pointer ${
                activeTab === "admin" || activeTab === "login"
                  ? "bg-green-800 text-white border-l-4 border-yellow-400"
                  : "text-green-200 hover:bg-green-800 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isAuthenticated ? adminIcon : loginIcon} />
              </svg>
              <span>{isAuthenticated ? "Admin" : "Login"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
