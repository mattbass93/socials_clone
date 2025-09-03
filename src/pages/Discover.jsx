import { useEffect, useState } from "react";
import { fetchPhotos, fetchVideos } from "../services/api";
import { FaRegPlayCircle, FaHeart, FaComment } from "react-icons/fa";
import PostModal from "../components/PostModal";

function Discover() {
  const [mediaForYou, setMediaForYou] = useState([]);
  const [mediaGeneric, setMediaGeneric] = useState([]);
  const [activeTab, setActiveTab] = useState("foryou");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const [photos, videos] = await Promise.all([
          fetchPhotos(30),
          fetchVideos(15),
        ]);

        const photoItems = photos.map((photo) => ({
          type: "image",
          url: photo.urls.small,
          alt: photo.alt_description || "Image",
        }));

        const videoItems = videos.map((video) => ({
          type: "video",
          url: video.video_files[0]?.link,
          alt: video.user.name || "Vidéo",
          thumbnail: video.image,
        }));

        const combined = [...photoItems, ...videoItems].sort(
          () => Math.random() - 0.5
        );

        const midpoint = Math.floor(combined.length / 2);
        setMediaForYou(combined.slice(0, midpoint));
        setMediaGeneric(combined.slice(midpoint));
      } catch (error) {
        console.error("Erreur Discover:", error);
      }
    }

    loadContent();
  }, []);

  const mediaToShow = activeTab === "foryou" ? mediaForYou : mediaGeneric;

  const handleOpenModal = (index) => {
    setSelectedIndex(index);
    setSelectedMedia(mediaToShow[index]);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % mediaToShow.length;
    setSelectedIndex(nextIndex);
    setSelectedMedia(mediaToShow[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex =
      (selectedIndex - 1 + mediaToShow.length) % mediaToShow.length;
    setSelectedIndex(prevIndex);
    setSelectedMedia(mediaToShow[prevIndex]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto md:ml-[13%] lg:ml-[13%] xl:ml-[20%] 2xl:ml-[25%] lg:max-w-4xl xl:max-w-5xl p-4">
      {/* Onglets */}
      <div className="flex space-x-6 mb-4">
        <span
          className={`cursor-pointer ${
            activeTab === "foryou"
              ? "text-white font-bold"
              : "text-gray-400 font-bold"
          }`}
          onClick={() => setActiveTab("foryou")}
        >
          Pour vous
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "generic"
              ? "text-white font-bold"
              : "text-gray-400 font-bold "
          }`}
          onClick={() => setActiveTab("generic")}
        >
          Non personnalisé
        </span>
      </div>

      {/* Grille de médias */}
      <div className="grid grid-cols-3 gap-2">
        {mediaToShow.map((item, index) => {
          const likes = Math.floor(Math.random() * 1000);
          const comments = Math.floor(Math.random() * 500);

          return (
            <div
              key={index}
              className="relative group cursor-pointer"
              onClick={() => handleOpenModal(index)}
            >
              <img
                src={item.type === "image" ? item.url : item.thumbnail}
                alt={item.alt}
                className="w-full h-full min-h-40 object-cover rounded-sm"
              />

              {/* Overlay semi-transparent */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 z-10 hidden md:block"></div>

              {/* Compteurs visibles seulement au hover */}
              <div className="absolute inset-0 z-20 flex items-center justify-center space-x-6 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 hidden md:flex">
                <div className="flex items-center space-x-1">
                  <FaHeart className="text-lg" />
                  <span>{likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaComment className="text-lg" />
                  <span>{comments}</span>
                </div>
              </div>

              {/* Icône vidéo */}
              {item.type === "video" && (
                <FaRegPlayCircle className="absolute top-2 right-2 text-white text-xl z-30" />
              )}
            </div>
          );
        })}
      </div>

      {/* Modale */}
      {selectedMedia && (
        <PostModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
}

export default Discover;
