// UI 목록
import TailSearch from "./UI/TailSearch";
function App() {

  return (
    <div className="w-full h-full flex items-start justify-center">
      <header className="w-full h-32 bg-white border border-gray-300">
        <div className="h-1/4 bg-sky-200 flex items-center justify-center">
          <p>Top Section (1/4)</p>
        </div>

        <div className="h-2/4 bg-sky-400 flex items-center justify-center">
          <TailSearch />
        </div>

        <div className="h-1/4 bg-sky-600 flex items-center justify-center">
          <p>Bottom Section (1/4)</p>
        </div>
      </header>
    </div>
  )
}

export default App
