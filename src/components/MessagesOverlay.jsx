import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";

function MessagesOverlay() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=8")
      .then((res) => {
        setUsers(res.data.results);
        setCurrentUser(res.data.results[0]); // le 1er user comme profil actuel
      })
      .catch(console.error);
  }, []);

  return (
    <div className="fixed left-20 top-0 bottom-0 w-[350px] bg-black border-r border-l border-gray-700 z-50 flex flex-col px-4 py-6 overflow-y-auto text-white">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-bold">
          {currentUser?.login.username || "Utilisateur"}
        </span>
        <FiEdit2 className="text-xl cursor-pointer" />
      </div>

      {/* Barre de recherche */}
      <div
        style={{ backgroundColor: "rgb(38, 38, 38)" }}
        className="flex items-center rounded px-3 py-2 mb-6"
      >
        <BiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Rechercher"
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>

      {/* Zone note */}
      {currentUser && (
        <div className=" items-center mb-6 space-x-3 cursor-pointer ml-3">
          <div className="relative flex flex-col ">
            <div className="absolute -top-2 -left-2 text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
              Note...
            </div>
            <img
              src={currentUser.picture.thumbnail}
              alt="note"
              className="w-17 h-17 rounded-full"
            />
          </div>
          <span className="text-sm text-gray-300">Votre note</span>
        </div>
      )}

      {/* Onglets */}
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-white font-bold text-m">Messages</p>
        <p className="text-gray-400 text-m cursor-pointer">Demandes</p>
      </div>

      {/* Liste des messages */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 pt-2 pb-2 w-full hover:bg-[rgb(38,38,38)] cursor-pointer"
          >
            <img
              src={user.picture.thumbnail}
              alt={user.login.username}
              className="w-14 h-14 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium truncate max-w-[180px]">
                {user.login.username}
              </span>
              <span className="text-gray-500 text-xs">
                En ligne il y a {Math.floor(Math.random() * 60)} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagesOverlay;
