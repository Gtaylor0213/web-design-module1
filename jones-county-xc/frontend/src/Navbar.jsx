import { useState } from "react"

const links = [
  { label: "Home", href: "#" },
  { label: "Athletes", href: "#athletes" },
  { label: "Meets", href: "#meets" },
  { label: "Results", href: "#results" },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-green-900 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-extrabold text-lg tracking-wider uppercase">JCXC</span>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium uppercase tracking-wide text-green-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden cursor-pointer p-1"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden border-t border-green-700 px-4 pb-3 pt-1">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-green-200 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}

export default Navbar
