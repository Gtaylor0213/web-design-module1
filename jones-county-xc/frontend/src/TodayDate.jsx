function TodayDate() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <p className="text-sm text-green-300/80 mt-3 tracking-wide">{today}</p>
  )
}

export default TodayDate
