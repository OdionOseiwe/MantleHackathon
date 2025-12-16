import Stream from "./pages/Stream/Stream";
import { BrowserRouter, Routes, Route } from "react-router"
import Withdraw from "./pages/Withdraw/Withdraw";
import History from "./pages/History/History";
import Hero from "./pages/Home/Hero";


function App() {
  return <>
    <BrowserRouter>
    <Routes>
      <Route  path="/" element={<Hero
       
      />}/>
      <Route  path="/stream" element={<Stream />}/>
      <Route  path="/withdraw" element={<Withdraw />}/>
      <Route  path="/history" element={<History />}/>
    </Routes>
      
    </BrowserRouter>
  </>;
}

export default App;
