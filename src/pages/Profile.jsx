import { useEffect, useState } from "react";
import { fetchPhotos, fetchUsers } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare } from "react-icons/fi";
import { MdGridOn } from "react-icons/md";
import { FaUserCircle, FaRegBookmark, FaUserPlus } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CreateModalMobile from "../components/CreateModalMobile";

function Profile() {
  const [user, setUser] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then((users) => setUser(users[0]))
      .catch(console.error);

    fetchPhotos(30).then(setAllPhotos).catch(console.error);
  }, []);

  if (!user) return <div className="text-white p-6">Chargement...</div>;

  const getPhotosByTab = () => {
    if (activeTab === "posts") return allPhotos.slice(0, 9);
    if (activeTab === "saved") return allPhotos.slice(9, 18);
    if (activeTab === "tagged") return allPhotos.slice(18, 27);
    return [];
  };

  const tabClass = (tab) =>
    `flex items-center px-4 py-3 cursor-pointer text-xs ${
      activeTab === tab
        ? "text-white border-b-2 border-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* ✅ Barre fixe en haut */}
      <div className="h-14 px-4 flex items-center justify-between sticky top-0 bg-black z-50 gap-4">
        {/* Nom d'utilisateur */}
        <h2 className="text-lg font-bold">{user?.login.username}</h2>

        {/* Icônes avec actions */}
        <div className="flex items-center gap-4">
          {/* Lien vers /threads */}
          <FaThreads
            className="text-xl cursor-pointer"
            onClick={() => navigate("/threads")}
          />

          {/* Ouvrir CreateModalMobile */}
          <FiPlusSquare
            className="text-xl cursor-pointer"
            onClick={() => setCreateModalOpen(true)}
          />

          {/* Lien vers paramètres et activité */}
          <RxHamburgerMenu
            className="text-xl cursor-pointer"
            onClick={() => navigate("/settings")}
          />
        </div>

        {/* Modal pour CreateModalMobile */}
        {isCreateModalOpen && (
          <CreateModalMobile
            onClose={() => setCreateModalOpen(false)} // Ferme le modal
          />
        )}
      </div>

      {/* ✅ En-tête */}
      <div className="flex items-center gap-3 mt-6 mb-4 px-4">
        {/* Avatar et statistiques */}
        <img
          src={user.picture.large}
          alt={user.login.username}
          className="w-14 h-14 rounded-full border-2 border-pink-500"
        />
        <div className="flex gap-3 text-sm mb-5">
          <span>
            <strong className="font-semibold">433</strong> publications
          </span>
          <span>
            <strong className="font-semibold">81k</strong> followers
          </span>
          <span>
            <strong className="font-semibold">92</strong> suivi(e)s
          </span>
        </div>
      </div>

      {/* Boutons sous l'en-tête */}
      <div className="flex gap-3 px-4 mb-2">
        {/* Bouton Modifier le profil */}
        <button className="bg-[#262626] text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:brightness-110">
          Modifier le profil
        </button>

        {/* Bouton Partager le profil */}
        <button className="bg-[#262626] text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:brightness-110">
          Partager le profil
        </button>

        {/* Bouton Ajouter un utilisateur */}
        <button className="bg-[#262626] text-white p-2 rounded-md hover:brightness-110">
          <FaUserPlus className="text-sm" />
        </button>
      </div>

      {/* ✅ Onglets */}
      <div className="flex justify-around border-b border-gray-700">
        <div
          className={tabClass("posts")}
          onClick={() => setActiveTab("posts")}
        >
          <MdGridOn className="text-lg" />
        </div>
        <div
          className={tabClass("saved")}
          onClick={() => setActiveTab("saved")}
        >
          <FaRegBookmark className="text-lg" />
        </div>
        <div
          className={tabClass("tagged")}
          onClick={() => setActiveTab("tagged")}
        >
          <FaUserCircle className="text-lg" />
        </div>
      </div>

      {/* ✅ Galerie d’images */}
      <div className="grid grid-cols-3 gap-[2px] px-[1px]">
        {getPhotosByTab().map((photo, i) => {
          const views = Math.floor(Math.random() * 10000) + 100;
          return (
            <div
              key={i}
              className="relative w-full aspect-square overflow-hidden"
            >
              <img
                src={photo.urls.small}
                alt={`post-${i}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-[10px] px-1.5 py-0.5 rounded">
                👁 {views.toLocaleString()} vues
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Profile;
