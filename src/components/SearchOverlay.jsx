import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

function SearchOverlay({ visible, onClose }) {
  const [users, setUsers] = useState([]);
  const overlayRef = useRef();

  // Charger des users fictifs
  useEffect(() => {
    if (visible) {
      axios
        .get("https://randomuser.me/api/?results=5")
        .then((res) => setUsers(res.data.results))
        .catch((err) => console.error(err));
    }
  }, [visible]);

  // Fermer si clic en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  // Supprimer user
  const removeUser = (index) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed left-13 top-0 bottom-0 bg-black w-100 bg-opacity-90 z-50 border-r border-gray-700 flex flex-col items-center overflow-y-auto"
    >
      <h2 className="w-90 text-white text-2xl mb-6 mt-5">Recherche</h2>

      {/* Barre de recherche */}
      <div className="w-90 max-w-md mb-8">
        <input
          type="text"
          placeholder="Rechercher"
          style={{ backgroundColor: "rgb(38, 38, 38)" }}
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none "
        />
      </div>

      {/* Section Recent */}
      <div className="w-90 mb-6">
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
              className="flex items-center justify-between pb-1 hover:bg-[rgb(38,38,38)] cursor-pointer"
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
                onClick={() => removeUser(index)}
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
