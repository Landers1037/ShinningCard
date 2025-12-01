import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import FlashcardContainer from "@/components/FlashcardContainer"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FlashcardContainer />} />
      </Routes>
    </Router>
  )
}