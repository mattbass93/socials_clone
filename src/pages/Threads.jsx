import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiMessageCircle,
  FiHeart,
  FiRepeat,
  FiShare2,
  FiSearch,
  FiUser,
  FiHome,
  FiPlus,
  FiAtSign,
} from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoArrowBack } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";

function Threads() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=6")
      .then((res) => {
        const users = res.data.results;
        const samplePosts = [
          {
            user: users[0],
            time: "2h",
            content:
              "Retour en prix d’interprétation au festival de Cannes, l’actrice Nadia Medhi...",
            media:
              "https://images.unsplash.com/photo-1607746882042-944635dfe10e?fit=crop&w=400&h=400",
          },
          {
            user: users[1],
            time: "3h",
            content:
              "Retour sur ce que la rédaction veut impérativement partager...",
            media:
              "https://images.unsplash.com/photo-1589998059171-988d887df646?fit=crop&w=400&h=400",
          },
          {
            user: users[1],
            time: "5h",
            content:
              "Entre jeux de longueurs et variations de blond : retour sur l’évolution...",
            media:
              "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?fit=crop&w=400&h=400",
          },
        ];

        setPosts(samplePosts);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col md:flex-row overflow-hidden z-50">
      {/* Sidebar gauche */}
      <div className="w-full md:w-20 h-16 md:h-full bg-black border-t md:border-t-0 md:border-r border-gray-800 flex md:flex-col items-center justify-between py-1 md:py-4 px-4 md:px-0">
        <div className="flex md:flex-col items-center space-x-6 md:space-x-0 md:space-y-8">
          <FiAtSign className="w-6 h-6" />
          <FiHome className="text-2xl text-white" />
          <FiSearch className="text-xl text-gray-400" />
          <button className="bg-[#262626] p-2 rounded-lg">
            <FiPlus className="text-xl text-white" />
          </button>
          <FaRegHeart className="text-xl text-gray-400" />
          <FiUser className="text-xl text-gray-400" />
        </div>

        <div className="hidden md:flex flex-col items-center space-y-6 mb-4">
          <HiOutlineMenuAlt2 className="text-xl text-gray-400" />
          <div className="w-6 h-0.5 bg-gray-600" />
        </div>
      </div>

      {/* Contenu central */}
      <div className="flex-1 overflow-y-auto pt-2 md:pt-4 flex justify-center">
        <div className="w-full max-w-xl px-4 pb-12">
          {/* Header avec retour et bouton se connecter */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-2xl"
            >
              <IoArrowBack />
            </button>

            <h1 className="text-lg md:text-xl font-bold text-center">
              Accueil
            </h1>
            <button className="bg-white text-black text-xs md:text-sm px-3 py-1 rounded font-medium">
              Se connecter
            </button>
          </div>

          {/* Liste des posts */}
          {posts.map((post, i) => (
            <div
              key={i}
              className="bg-[#121212] border border-gray-800 rounded-lg p-4 mb-4 md:mb-6"
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={post.user.picture.thumbnail}
                  alt={post.user.name.first}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {post.user.login.username}
                    </span>
                    <span className="text-xs text-gray-500">· {post.time}</span>
                  </div>
                  <p className="text-sm mt-1 leading-relaxed">{post.content}</p>
                </div>
              </div>

              {post.media && (
                <div className="w-full h-64 md:h-80 rounded-md overflow-hidden mb-3">
                  <img
                    src={post.media}
                    alt="media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex justify-around text-gray-400 text-lg">
                <FiMessageCircle className="cursor-pointer hover:text-white" />
                <FiRepeat className="cursor-pointer hover:text-white" />
                <FiHeart className="cursor-pointer hover:text-white" />
                <FiShare2 className="cursor-pointer hover:text-white" />
              </div>
            </div>
          ))}

          {/* Footer */}
          <footer className="text-xs text-gray-500 text-center mt-4 md:mt-12 leading-5">
            <p className="mb-1">© 2025 Conditions générales de Threads</p>
            <p className="mb-1">
              Politique de confidentialité · Politique d’utilisation des cookies
              · Paramètres de cookies
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Threads;
