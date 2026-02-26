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
            <div className="relative bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white py-24 px-6 text-center shadow-xl overflow-hidden">
              {/* Subtle radial glow behind text */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.15)_0%,_transparent_70%)]" aria-hidden="true" />
              <div className="relative">
                <img src="/jc-logo.png" alt="Jones County Greyhounds logo" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-sm font-semibold tracking-[0.3em] uppercase text-green-400 mb-4">
                  Home of the Greyhounds
                </p>
                <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-3 uppercase leading-tight">
                  <span className="text-white">Jones County</span>
                  <br />
                  <span className="text-yellow-400">Cross Country</span>
                </h1>
                <div className="w-20 h-1 bg-yellow-400 mx-auto mt-6 mb-5 rounded-full" aria-hidden="true" />
                <TodayDate />
              </div>
            </div>
            <div className="w-full max-w-4xl mx-auto px-4 mt-10 pb-10">
              <img
                src="/team-photo.png"
                alt="Jones County Cross Country team posing with trophies"
                className="w-full rounded-xl shadow-lg"
              />
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
