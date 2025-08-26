import { useEffect, useState } from "react";
import { FaCamera, FaPen, FaArrowLeft } from "react-icons/fa";

import MessagesOverlay from "../components/MessagesOverlay";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Messages() {
  const [users, setUsers] = useState([]);
  const [headerUser, setHeaderUser] = useState(null); // 👈 utilisateur de l'en-tête
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=6")
      .then((res) => {
        const userList = res.data.results;
        setUsers(userList);
        setHeaderUser(userList[Math.floor(Math.random() * userList.length)]); // 👈 choix aléatoire
      })
      .catch(console.error);
  }, []);

  return (
    <div className="h-screen w-full bg-black text-white">
      {/* ✅ Layout mobile-first */}
      <div className="lg:hidden flex flex-col h-full">
        {/* ✅ Topbar mobile */}
        <div className="lg:hidden h-14 w-full px-4 flex items-center justify-between border-b border-gray-800 sticky top-0 bg-black z-50">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <FaArrowLeft className="text-lg" />
            </button>
            <h2 className="text-lg font-bold">
              {headerUser ? headerUser.login.username : "Chargement..."}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xl">
            <FaCamera />
            <FaPen />
          </div>
        </div>

        {/* Champ de recherche */}
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Demander à Meta AI ou rechercher..."
            className="w-full bg-neutral-900 text-sm rounded-full px-4 py-2 placeholder-gray-400 text-white"
          />
        </div>

        {/* Stories */}
        <div className="flex gap-4 px-4 overflow-x-auto pb-2">
          {users.map((user, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-xs text-white"
            >
              <img
                src={user.picture.thumbnail}
                className="w-12 h-12 rounded-full"
                alt={user.login.username}
              />
              <span className="truncate w-14 text-center mt-1">
                {user.login.username}
              </span>
            </div>
          ))}
        </div>

        {/* Liste des messages */}
        <div className="px-4 flex justify-between items-center mt-4 mb-2">
          <h3 className="text-sm font-semibold">Messages</h3>
          <span className="text-sm text-blue-500 cursor-pointer">
            Invitations
          </span>
        </div>

        <div className="flex flex-col gap-4 px-4 overflow-y-auto flex-1 pb-4">
          {users.map((user, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <img
                  src={user.picture.thumbnail}
                  className="w-12 h-12 rounded-full"
                  alt={user.login.username}
                />
                <div>
                  <p className="text-sm font-semibold">{user.login.username}</p>
                  <p className="text-xs text-gray-400">En ligne</p>
                </div>
              </div>
              <FaCamera className="text-gray-400 text-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Layout desktop */}
      <div className="hidden lg:flex h-full">
        <div className="absolute top-0 left-0 z-50">
          <MessagesOverlay />
        </div>

        <div className="flex-1 ml-55 flex flex-col items-center justify-center text-center px-4">
          <FaCamera className="text-8xl mb-4 border rounded-full p-3 border-white" />
          <h2 className="text-xl">Vos messages</h2>
          <p className="text-gray-400 mb-4 mt-1 text-sm">
            Envoyez des photos et des messages privés à un(e) ami(e) ou à un
            groupe
          </p>
          <button
            style={{ backgroundColor: "rgb(65, 80, 247)" }}
            className="hover:brightness-90 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            Envoyer un message
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;
