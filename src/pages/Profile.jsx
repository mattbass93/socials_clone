import { useEffect, useState } from "react";
import { fetchPhotos, fetchUsers } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare, FiSettings, FiEye } from "react-icons/fi";
import { MdGridOn } from "react-icons/md";
import { FaUserCircle, FaRegBookmark, FaUserPlus } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CreateModalMobile from "../components/CreateModalMobile";
import Footer from "../components/Footer";
import ProfileStory from "../components/ProfileStory";
import PostModal from "../components/PostModal";

function Profile() {
  const [user, setUser] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [highlights, setHighlights] = useState([]); // ✅ stories du même utilisateur
  const [activeTab, setActiveTab] = useState("posts");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // ✅ État PostModal
  const [isPostOpen, setPostOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()
      .then((users) => setUser(users[0]))
      .catch(console.error);

    fetchPhotos(30)
      .then((photos) => {
        setAllPhotos(photos);

        // ✅ Titres de stories du même utilisateur
        const defaultTitles = [
          "Voyage",
          "Vacances",
          "Soirée",
          "Concert",
          "Cuisine",
          "Gym",
        ];

        const coverFallback =
          photos[0]?.urls?.small || photos[0]?.urls?.regular || "";

        const list = defaultTitles.map((title, idx) => ({
          title,
          cover:
            photos[idx]?.urls?.small ||
            photos[idx]?.urls?.regular ||
            coverFallback,
        }));

        setHighlights(list);
      })
      .catch(console.error);
  }, []);

  if (!user) return <div className="text-white p-6">Chargement...</div>;

  const getPhotosByTab = () => {
    if (activeTab === "posts") return allPhotos.slice(0, 9);
    if (activeTab === "saved") return allPhotos.slice(9, 18);
    if (activeTab === "tagged") return allPhotos.slice(18, 27);
    return [];
  };

  // ✅ Liste des médias pour la modale (selon l’onglet actif)
  const tabPhotos = getPhotosByTab();
  const modalItems = tabPhotos.map((photo) => ({
    type: "image",
    url: photo?.urls?.regular || photo?.urls?.small || "",
    alt: photo?.alt_description || "Image",
  }));

  const tabClass = (tab) =>
    `flex items-center px-4 py-3 cursor-pointer text-xs ${
      activeTab === tab
        ? "text-white border-b-2 border-white"
        : "text-gray-400 hover:text-white"
    }`;

  const displayName = user?.name?.first || "Matthis";
  const postsCount = allPhotos.length; // ✅ compteur desktop dynamique

  // ✅ Ouvrir/fermer PostModal
  const openPostAt = (index) => {
    setSelectedIndex(index);
    setPostOpen(true);
  };
  const closePost = () => {
    setPostOpen(false);
    setSelectedIndex(null);
  };

  const handleNext = () => {
    if (!modalItems.length) return;
    setSelectedIndex((prev) => ((prev ?? 0) + 1) % modalItems.length);
  };
  const handlePrev = () => {
    if (!modalItems.length) return;
    setSelectedIndex((prev) =>
      prev == null ? 0 : (prev - 1 + modalItems.length) % modalItems.length
    );
  };

  // ✅ Garde d’affichage : évite tout rendu invalide et supprime le besoin d’un useEffect
  const hasModalMedia =
    isPostOpen &&
    selectedIndex != null &&
    selectedIndex >= 0 &&
    selectedIndex < modalItems.length;

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* ===================== MOBILE / TABLET (<= lg-1) ===================== */}
      <div className="md:ml-[10%]  lg:hidden">
        {/* Barre fixe en haut */}
        <div className="h-14 px-4 flex items-center justify-between bg-black z-50 gap-4">
          <h2 className="text-lg font-bold">{user?.login.username}</h2>

          <div className="flex items-center gap-4">
            <FaThreads
              className="text-xl cursor-pointer"
              onClick={() => navigate("/threads")}
            />
            <FiPlusSquare
              className="text-xl cursor-pointer"
              onClick={() => setCreateModalOpen(true)}
            />
            <RxHamburgerMenu
              className="text-xl cursor-pointer"
              onClick={() => navigate("/settings")}
            />
          </div>

          {isCreateModalOpen && (
            <CreateModalMobile onClose={() => setCreateModalOpen(false)} />
          )}
        </div>

        {/* En-tête */}
        <div className="flex items-center gap-3 mt-6 mb-4 px-4">
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

        {/* Boutons */}
        <div className="flex gap-3 px-4 mb-2">
          <button className="bg-[#262626] text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:brightness-110">
            Modifier le profil
          </button>
          <button className="bg-[#262626] text-white text-xs md:text-sm px-4 py-2 rounded-md font-semibold hover:brightness-110">
            Partager le profil
          </button>
          <button className="bg-[#262626] text-white p-2 rounded-md hover:brightness-110">
            <FaUserPlus className="text-sm" />
          </button>
        </div>

        {/* Onglets */}
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

        {/* Galerie d’images (mobile) */}
        <div className="grid grid-cols-3 gap-[2px] px-[1px]">
          {tabPhotos.map((photo, i) => {
            const views = Math.floor(Math.random() * 10000) + 100;
            return (
              <div
                key={i}
                className="relative w-full aspect-square overflow-hidden cursor-pointer"
                onClick={() => openPostAt(i)}
                role="button"
                aria-label={`Ouvrir le post ${i + 1}`}
              >
                <img
                  src={photo.urls.small}
                  alt={`post-${i}`}
                  className="w-full h-full object-cover"
                />
                {/* ✅ Icône œil + nombre de vues, sans background opaque */}
                <div className="absolute bottom-1 right-1 flex items-center gap-1 text-white text-[10px] font-semibold">
                  <FiEye className="text-[12px]" />
                  {views.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== DESKTOP (>= lg) ===================== */}
      <div className="hidden lg:block lg:ml-[5%] xl:ml-[20%]">
        <div className="max-w-5xl lg:ml-[5%] mx-auto pt-10">
          {/* En-tête desktop */}
          <div className="flex gap-16">
            {/* Avatar à gauche */}
            <div className="flex-shrink-0 w-[180px] flex items-center justify-center">
              <img
                src={user.picture.large}
                alt={user.login.username}
                className="w-36 h-36 rounded-full"
              />
            </div>

            {/* Infos à droite */}
            <div className="flex-1">
              {/* Ligne username + actions */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl">{user?.login.username}</h1>

                <button className="bg-[#262626] text-white text-sm px-4 py-1.5 rounded-md font-semibold hover:brightness-110">
                  Modifier le profil
                </button>

                <button className="bg-[#262626] text-white text-sm px-4 py-1.5 rounded-md font-semibold hover:brightness-110">
                  Voir l'archive
                </button>

                <button
                  aria-label="Paramètres"
                  className="p-2 hover:bg-[#1a1a1a] rounded-md"
                  onClick={() => navigate("/settings")}
                >
                  <FiSettings className="text-xl" />
                </button>
              </div>

              {/* Stats (✅ publications dynamiques) */}
              <div className="flex gap-8 mt-6">
                <span>
                  <strong className="font-semibold">{postsCount}</strong>{" "}
                  publications
                </span>
                <span>
                  <strong className="font-semibold">54</strong> followers
                </span>
                <span>
                  <strong className="font-semibold">71</strong> suivi(e)s
                </span>
              </div>

              {/* Nom */}
              <div className="mt-3 font-semibold">{displayName}</div>
            </div>
          </div>

          {/* Stories (highlights du même utilisateur) */}
          <div className="mt-10 overflow-x-auto">
            <div className="flex items-center gap-10">
              {/* Story "Nouveau" */}
              <ProfileStory isAdd label="Nouveau" />

              {/* Stories de l'utilisateur (titres) */}
              {highlights.map((h, idx) => (
                <ProfileStory
                  key={`${h.title}-${idx}`}
                  image={h.cover}
                  label={h.title}
                />
              ))}
            </div>
          </div>

          {/* Séparateur */}
          <div className="mt-8 border-t border-gray-700" />

          {/* Onglets centrés (icônes) */}
          <div className="flex items-center justify-center gap-10 mt-2">
            <button
              onClick={() => setActiveTab("posts")}
              className={`h-10 px-4 flex items-center justify-center ${
                activeTab === "posts"
                  ? "border-b border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="posts"
            >
              <MdGridOn className="text-lg" />
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`h-10 px-4 flex items-center justify-center ${
                activeTab === "saved"
                  ? "border-b border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="saved"
            >
              <FaRegBookmark className="text-lg" />
            </button>

            <button
              onClick={() => setActiveTab("tagged")}
              className={`h-10 px-4 flex items-center justify-center ${
                activeTab === "tagged"
                  ? "border-b border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              aria-label="tagged"
            >
              <FaUserCircle className="text-lg" />
            </button>
          </div>

          {/* Galerie d’images desktop : 3 colonnes de 310px → 930px total */}
          <div className="mx-auto mt-6 w-[930px]">
            <div className="grid grid-cols-3 gap-0">
              {tabPhotos.map((photo, i) => {
                const views = Math.floor(Math.random() * 10000) + 100;
                return (
                  <div
                    key={i}
                    className="relative w-[310px] aspect-square overflow-hidden cursor-pointer"
                    onClick={() => openPostAt(i)}
                    role="button"
                    aria-label={`Ouvrir le post ${i + 1}`}
                  >
                    <img
                      src={photo.urls.small}
                      alt={`post-${i}`}
                      className="w-full h-full object-cover"
                    />
                    {/* ✅ Icône œil + nombre de vues, sans background opaque */}
                    <div className="absolute bottom-1 right-1 flex items-center gap-1 text-white text-[10px] md:text-xs font-semibold">
                      <FiEye className="text-lg" />
                      {views.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Create (réutilisé) */}
        {isCreateModalOpen && (
          <CreateModalMobile onClose={() => setCreateModalOpen(false)} />
        )}

        {/* Footer (déjà existant) */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <Footer />
        </div>
      </div>

      {/* ✅ PostModal — à la racine (un seul rendu) */}
      {hasModalMedia && (
        <PostModal
          media={modalItems[selectedIndex]}
          onClose={closePost}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

export default Profile;
