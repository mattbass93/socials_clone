import { useEffect, useState } from "react";
import { fetchPhotos, fetchUsers } from "../services/api";
import { IoIosSettings } from "react-icons/io";
import { MdGridOn } from "react-icons/md";
import { FaUserCircle, FaRegBookmark } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

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
    `flex items-center px-6 py-4 cursor-pointer ${
      activeTab === tab
        ? "text-white border-b-2 border-white"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <div className="text-white p-8 max-w-5xl mx-auto flex flex-col items-center">
      {/* En-tête */}
      <div className="flex items-center space-x-10 mb-6">
        <div className="relative flex flex-col">
          <div className="absolute -top-10 -left-0 text-sm bg-gray-700 text-white px-3 py-4 rounded-full">
            Note...
          </div>
          <img
            src={user.picture.large}
            alt={user.login.username}
            className="w-32 h-32 rounded-full border-2 border-pink-500"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h2 className="text-2xl">{user.login.username}</h2>
            <button className="bg-gray-800 text-white text-sm px-4 py-1 rounded font-semibold border border-gray-600">
              Modifier profil
            </button>
            <button className="bg-gray-800 text-white text-sm px-4 py-1 rounded font-semibold border border-gray-600">
              Voir l’archive
            </button>
            <IoIosSettings className="text-2xl" />
          </div>
          <div className="flex space-x-6 text-sm mb-3">
            <span>
              <strong className="font-semibold">433</strong> publications
            </span>
            <span>
              <strong className="font-semibold">81k</strong> abonnés
            </span>
            <span>
              <strong className="font-semibold">92</strong> abonnements
            </span>
          </div>
          <div className="text-sm leading-5">
            <p className="font-semibold">
              {user.name.first} {user.name.last}
            </p>
            <p>
              {user.location.city}, {user.location.country}
            </p>
            <p>{user.email}</p>
            <p className="text-blue-400">www.{user.login.username}.com</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex justify-around w-full border-b border-gray-700 mt-6">
        <div
          className={tabClass("posts")}
          onClick={() => setActiveTab("posts")}
        >
          <MdGridOn className="text-2xl" />
        </div>
        <div
          className={tabClass("saved")}
          onClick={() => setActiveTab("saved")}
        >
          <FaRegBookmark className="text-2xl" />
        </div>
        <div
          className={tabClass("tagged")}
          onClick={() => setActiveTab("tagged")}
        >
          <FaUserCircle className="text-2xl" />
        </div>
      </div>

      {/* Grille d’images */}
      <div className="grid grid-cols-3 gap-1 mt-2">
        {getPhotosByTab().map((photo, i) => {
          const views = Math.floor(Math.random() * 10000) + 100; // simulate 100-10100 vues
          return (
            <div key={i} className="relative">
              <img
                src={photo.urls.small}
                alt={`post-${i}`}
                className="w-full aspect-square object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
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
