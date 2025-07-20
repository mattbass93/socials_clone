import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";

function Sidebar() {
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Charger un user principal
    fetchUsers(1).then((users) => setUser(users[0]));
    // Charger les suggestions
    fetchUsers(5).then(setSuggestions);
  }, []);

  if (!user) return null;

  return (
    <div className="w-80 ml-auto p-6 text-sm text-gray-400 space-y-6">
      {/* Profil utilisateur principal */}
      <div className="flex items-center space-x-3">
        <img
          src={user.picture.thumbnail}
          alt={user.login.username}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-white font-semibold">{user.login.username}</p>
          <p className="text-gray-400 text-sm">
            {user.location.city}, {user.location.country}
          </p>
        </div>
        <span className="ml-auto text-blue-500 cursor-pointer hover:underline">
          Basculer
        </span>
      </div>

      {/* Suggestions */}
      <div className="flex justify-between items-center">
        <p className="text-white-500 font-semibold">Suggestions pour vous</p>
        <p className="text-white text-xs cursor-pointer hover:underline">
          Voir tout
        </p>
      </div>

      {/* Liste des suggestions */}
      <div className="space-y-4">
        {suggestions.map((sug, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <img
              src={sug.picture.thumbnail}
              alt={sug.login.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-semibold">{sug.login.username}</p>
              <p className="text-gray-400 text-xs">
                {sug.location.city}, {sug.location.country}
              </p>
            </div>
            <span className="ml-auto text-blue-500 text-xs cursor-pointer hover:underline">
              Suivre
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap text-xs text-gray-500 gap-x-1 gap-y-1 mt-6">
        {[
          "À propos",
          "Aide",
          "Presse",
          "API",
          "Emplois",
          "Confidentialité",
          "Conditions",
          "Lieux",
          "Langue",
          "Meta Verified",
          "Résilier des contrats ici",
        ].map((item, idx, arr) => (
          <span key={idx}>
            {item}
            {idx < arr.length - 1 && <span className="mx-1">·</span>}
          </span>
        ))}
        <div className="w-full pt-4">© 2025 INSTAGRAM PAR MATTHIS</div>
      </div>
    </div>
  );
}

export default Sidebar;
