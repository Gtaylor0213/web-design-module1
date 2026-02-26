import { useState } from "react"
import AthleteList from "./AthleteList"
import MeetResults from "./MeetResults"
import TodayDate from "./TodayDate"
import UpcomingMeets from "./UpcomingMeets"
import RaceCategorySelect from "./RaceCategorySelect"
import Navbar from "./Navbar"

function App() {
  const [raceCategory, setRaceCategory] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-14 px-4 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2 uppercase">
          <span className="text-white">Jones County</span>{" "}
          <span className="text-green-300">Cross Country</span>
        </h1>
        <p className="text-lg font-medium text-green-200 tracking-wide">
          Home of the Greyhounds
        </p>
        <TodayDate />
      </div>
      <div className="py-10">
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
