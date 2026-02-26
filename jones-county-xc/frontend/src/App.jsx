import AthleteList from "./AthleteList"
import MeetList from "./MeetList"
import MeetResults from "./MeetResults"

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-10 px-4 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Jones County Cross Country
        </h1>
        <p className="text-lg text-blue-200">
          Home of the Greyhounds
        </p>
      </div>
      <div className="text-center py-8">
        <AthleteList />
        <MeetList />
        <MeetResults meetId={1} meetName="Jones County Invitational" />
      </div>
    </div>
  )
}

export default App
