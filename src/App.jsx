import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Messages from "./pages/Messages";
import Reels from "./pages/Reels";
import SearchOverlay from "./components/SearchOverlay";
import NotificationsOverlay from "./components/NotificationsOverlay";
import MessagesOverlay from "./components/MessagesOverlay";
import Profile from "./pages/Profile";
import MetaAi from "./pages/MetaAi";
import AiStudio from "./pages/AiStudio";
import Threads from "./pages/Threads";

function App() {
  const [activeOverlay, setActiveOverlay] = useState(null); // 'search' | 'notifications' | 'messages' | null

  const handleOverlay = (overlayName) => {
    setActiveOverlay((prev) => (prev === overlayName ? null : overlayName));
  };

  return (
    <BrowserRouter>
      <div className="flex">
        <Navbar
          activeOverlay={activeOverlay}
          onSearchClick={() => handleOverlay("search")}
          onNotificationsClick={() => handleOverlay("notifications")}
          onMessagesClick={() => handleOverlay("messages")}
        />

        <div className=" w-[100%]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/meta_ai" element={<MetaAi />} />
            <Route path="/ai_studio" element={<AiStudio />} />
            <Route path="/threads" element={<Threads />} />
          </Routes>
        </div>
      </div>

      {activeOverlay === "search" && (
        <SearchOverlay onClose={() => setActiveOverlay(null)} />
      )}
      {activeOverlay === "notifications" && (
        <NotificationsOverlay onClose={() => setActiveOverlay(null)} />
      )}
      {activeOverlay === "messages" && (
        <MessagesOverlay onClose={() => setActiveOverlay(null)} />
      )}
    </BrowserRouter>
  );
}

export default App;
