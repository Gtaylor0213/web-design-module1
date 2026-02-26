import { useState } from "react"
import AthleteList from "./AthleteList"
import MeetResults from "./MeetResults"
import TodayDate from "./TodayDate"
import UpcomingMeets from "./UpcomingMeets"
import RaceCategorySelect from "./RaceCategorySelect"

function App() {
  const [raceCategory, setRaceCategory] = useState("")

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-10 px-4 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          <span className="text-green-300">Jones County</span>{" "}
          <span className="text-yellow-400">Cross Country</span>
        </h1>
        <p className="text-lg text-green-200">
          Home of the Greyhounds
        </p>
        <TodayDate />
      </div>
      <div className="text-center py-8">
        <UpcomingMeets />
        <div className="mt-8 w-full max-w-4xl mx-auto px-4 flex justify-start">
          <RaceCategorySelect value={raceCategory} onChange={setRaceCategory} />
        </div>
        <AthleteList />
        <MeetResults meetId={1} meetName="Jones County Invitational" />
      </div>
    </div>
  )
}

export default App
