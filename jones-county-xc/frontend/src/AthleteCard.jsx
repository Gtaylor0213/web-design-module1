import { Button } from "@/components/ui/button"

function AthleteCard({ name, grade, time, events, gender, team, onViewDetails }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-green-400 hover:scale-[1.02] transition-all">
      <h3 className="text-lg font-bold text-gray-900">{name}</h3>
      {team && (
        <span className="inline-block text-xs font-medium text-green-700 bg-green-100 rounded-full px-2 py-0.5 mt-1">
          {team}
        </span>
      )}
      <p className="text-sm text-gray-500 mt-1">
        Grade {grade}{gender ? ` \u00B7 ${gender}` : ""}
      </p>
      <p className="text-sm text-green-600 font-semibold mt-1 flex items-center gap-1.5">
        <svg className="w-4 h-4 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        PR: {time}
      </p>
      {events && (
        <p className="text-sm text-gray-500 mt-1">Events: {events}</p>
      )}
      <Button
        variant="default"
        className="mt-3 w-full cursor-pointer"
        onClick={onViewDetails}
      >
        View Details
      </Button>
    </div>
  )
}

export default AthleteCard
