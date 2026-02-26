function TodayDate() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <p className="text-sm text-green-100 mt-2">{today}</p>
  )
}

export default TodayDate
