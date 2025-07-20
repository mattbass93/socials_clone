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

        <div className="ml-64 flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
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
