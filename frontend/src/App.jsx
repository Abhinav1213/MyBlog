import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Signin from "./components/Signin"
import HeroSection from "./pages/HeroSection"
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signin" element={<Signin/>}/>
      <Route path="/" element={<HeroSection/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
