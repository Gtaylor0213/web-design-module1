import { Button } from "@/components/ui/button"

function AthleteCard({ name, grade, time }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-5 text-left hover:shadow-xl hover:border-green-500 hover:scale-105 hover:bg-green-50 transition-all">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">Grade {grade}</p>
      <p className="text-sm text-green-700 font-medium mt-1 flex items-center gap-1.5">
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        PR: {time}
      </p>
      <Button
        variant="outline"
        className="mt-3 w-full cursor-pointer"
        onClick={() => alert(`Details for ${name} coming soon!`)}
      >
        View Details
      </Button>
    </div>
  )
}

export default AthleteCard
