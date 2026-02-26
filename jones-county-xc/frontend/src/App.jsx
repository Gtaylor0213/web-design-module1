import { useState } from "react"
import AthleteList from "./AthleteList"
import MeetResults from "./MeetResults"
import TodayDate from "./TodayDate"
import UpcomingMeets from "./UpcomingMeets"
import RaceCategorySelect from "./RaceCategorySelect"
import Sidebar from "./Sidebar"

function App() {
  const [activeTab, setActiveTab] = useState("home")
  const [raceCategory, setRaceCategory] = useState("")

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content - offset by sidebar width on desktop */}
      <main className="md:ml-64 min-h-screen">
        {activeTab === "home" && (
          <>
            <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white py-14 px-4 text-center shadow-lg">
              <h1 className="text-5xl font-extrabold tracking-tight mb-2 uppercase">
                <span className="text-white">Jones County</span>{" "}
                <span className="text-yellow-400">Cross Country</span>
              </h1>
              <p className="text-lg font-medium text-green-200 tracking-wide">
                Home of the Greyhounds
              </p>
              <TodayDate />
            </div>
            <div className="py-10">
              <UpcomingMeets />
            </div>
          </>
        )}

        {activeTab === "athletes" && (
          <div className="py-10">
            <div className="w-full max-w-4xl mx-auto px-4 mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Athletes</h1>
            </div>
            <AthleteList />
          </div>
        )}

        {activeTab === "meets" && (
          <div className="py-10">
            <div className="w-full max-w-4xl mx-auto px-4 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Meets</h1>
            </div>
            <UpcomingMeets />
          </div>
        )}

        {activeTab === "results" && (
          <div className="py-10">
            <div className="w-full max-w-4xl mx-auto px-4 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight">Results</h1>
            </div>
            <div className="w-full max-w-4xl mx-auto px-4 mt-4 mb-2">
              <RaceCategorySelect value={raceCategory} onChange={setRaceCategory} />
            </div>
            <MeetResults meetId={1} meetName="Jones County Invitational" />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
