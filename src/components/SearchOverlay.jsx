import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

function SearchOverlay({ visible, onClose }) {
  const [users, setUsers] = useState([]);
  const panelRef = useRef(null);

  // Charger des users fictifs quand visible
  useEffect(() => {
    if (!visible) return;
    axios
      .get("https://randomuser.me/api/?results=5")
      .then((res) => setUsers(res.data.results))
      .catch((err) => console.error(err));
  }, [visible]);

  // Fermer si clic en dehors du panneau
  useEffect(() => {
    if (!visible) return;

    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed left-11 top-0 bottom-0 w-[350px] bg-black z-[60] border-r border-gray-700 flex flex-col items-center overflow-y-auto"
    >
      <h2 className="w-11/12 text-white text-2xl mb-6 mt-5">Recherche</h2>

      {/* Barre de recherche */}
      <div className="w-11/12 max-w-md mb-8">
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full px-4 py-2 rounded-md bg-[rgb(38,38,38)] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Section Récent */}
      <div className="w-11/12 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg">Récent</h3>
          <button
            onClick={() => setUsers([])}
            className="text-blue-500 hover:underline"
          >
            Tout effacer
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between pb-1 hover:bg-[rgb(38,38,38)] cursor-pointer rounded-md px-2"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture.thumbnail}
                  alt={user.login.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-white font-semibold">
                    {user.login.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setUsers((prev) => prev.filter((_, i) => i !== index))
                }
                className="text-gray-400 text-xl"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun compte récent.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
