function AthleteCard({ name, grade, time }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:shadow-lg hover:border-green-400 hover:scale-[1.02] transition-all cursor-pointer">
      <h3 className="text-lg font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">Grade {grade}</p>
      <p className="text-sm text-green-700 font-medium mt-1">PR: {time}</p>
    </div>
  )
}

export default AthleteCard
