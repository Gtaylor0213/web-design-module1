import AthleteList from "./AthleteList"
import MeetList from "./MeetList"
import MeetResults from "./MeetResults"

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Jones County XC
        </h1>
        <p className="text-gray-600">
          Welcome to the Jones County Cross Country application
        </p>
        <AthleteList />
        <MeetList />
        <MeetResults meetId={1} meetName="Jones County Invitational" />
      </div>
    </div>
  )
}

export default App
