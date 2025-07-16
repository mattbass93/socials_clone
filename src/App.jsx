import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Profile from "./pages/Profile" etc

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Navbar /> {/* toujours fixe à gauche */}
        <div className="ml-64 flex-1 p-6">
          {" "}
          {/* ton contenu se décale */}
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/profile/:username" element={<Profile />} /> */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
