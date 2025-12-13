import Home from "./pages/Home/Home";
import Stream from "./pages/Stream/Stream";
import { BrowserRouter, Routes, Route } from "react-router"
import Withdraw from "./pages/Withdraw/Withdraw";

function App() {
  return <>
    <BrowserRouter>
    <Routes>
      <Route  path="/" element={<Home />}/>
      <Route  path="/stream" element={<Stream />}/>
      <Route  path="/withdraw" element={<Withdraw />}/>
    </Routes>
      
    </BrowserRouter>
  </>;
}

export default App;
