const meets = [
  { name: "Jones County Invitational", date: "March 15, 2026", location: "Jones County High School" },
  { name: "Peach State Classic", date: "March 29, 2026", location: "Fort Valley State University" },
  { name: "Central Georgia Championship", date: "April 12, 2026", location: "Robins Air Force Base" },
  { name: "Region 2-AAAA Meet", date: "April 26, 2026", location: "Veterans High School" },
]

function UpcomingMeets() {
  return (
    <div className="mt-8 w-full max-w-4xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-5 text-left">Upcoming Meets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meets.map((meet) => (
          <button
            key={meet.name}
            onClick={() => alert(`Details for "${meet.name}" coming soon!`)}
            className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-green-400 hover:scale-[1.01] transition-all cursor-pointer"
          >
            <h3 className="font-bold text-gray-900 mb-2">{meet.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {meet.date}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
              <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {meet.location}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default UpcomingMeets
