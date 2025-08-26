import { useEffect, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { FiSend } from "react-icons/fi";
import { fetchVideos, fetchUsers } from "../services/api";
import CommentModal from "../components/CommentModal";

export default function Reels() {
  const [reelsData, setReelsData] = useState([]);
  const [likedMap, setLikedMap] = useState({}); // { [id]: boolean }
  const [expandedMap, setExpandedMap] = useState({}); // { [id]: boolean } -> description étendue ?
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentReelForComments, setCurrentReelForComments] = useState(null);

  // Seuil approximatif au-delà duquel on affiche "Plus"
  const DESCRIPTION_CUTOFF = 80;

  useEffect(() => {
    async function loadData() {
      try {
        const [videos, users] = await Promise.all([
          fetchVideos(10),
          fetchUsers(10),
        ]);

        const reels = videos
          .filter((v) => v.video_files && v.video_files.length > 0)
          .map((video, i) => {
            const url =
              video.video_files.find((f) => f.quality === "sd")?.link ||
              video.video_files[0]?.link;

            return {
              id: video.id,
              url,
              title: faker.lorem.words(4),
              description: faker.lorem.paragraphs({ min: 1, max: 2 }),
              audio: `${faker.word.adjective()} · Audio`,
              user: {
                username: users[i % users.length].login.username,
                avatar: users[i % users.length].picture.thumbnail,
              },
              likes: faker.number.int({ min: 1_000, max: 999_000 }),
              comments: faker.number.int({ min: 10, max: 500 }),
            };
          });

        setReelsData(reels);
      } catch (error) {
        console.error("Erreur lors du chargement des Reels :", error);
      }
    }

    loadData();
  }, []);

  const formatCompact = (n) =>
    new Intl.NumberFormat("fr-FR", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(n);

  const toggleLike = (reelId) => {
    setLikedMap((prev) => {
      const nextLiked = !prev[reelId];
      setReelsData((prevReels) =>
        prevReels.map((r) =>
          r.id === reelId ? { ...r, likes: r.likes + (nextLiked ? 1 : -1) } : r
        )
      );
      return { ...prev, [reelId]: nextLiked };
    });
  };

  const toggleExpand = (reelId) => {
    setExpandedMap((prev) => ({ ...prev, [reelId]: !prev[reelId] }));
  };

  const openComments = (reel) => {
    setCurrentReelForComments(reel);
    setIsCommentsOpen(true);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
    setCurrentReelForComments(null);
  };

  return (
    <div className="w-full h-screen mx-auto bg-black text-white relative overflow-hidden">
      {/* Flux vertical plein écran avec snap */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory snap-always">
        {reelsData.map((reel) => {
          const isExpanded = !!expandedMap[reel.id];
          const isLong = (reel.description || "").length > DESCRIPTION_CUTOFF;

          return (
            <div
              key={reel.id}
              className="
                relative w-full h-screen snap-start bg-black overflow-hidden
                lg:h-[700px] lg:my-8 lg:snap-center lg:flex lg:items-center lg:justify-center
              "
            >
              {/* === CONTENEUR VIDÉO (taille fixe en lg pour 382x640) === */}
              <div className="relative w-full h-full lg:w-[382px] lg:h-[640px]">
                {/* Vidéo en fond, couvre le conteneur */}
                <video
                  src={reel.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover bg-black z-0"
                />

                {/* Gradients (dans le wrapper vidéo) */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10" />

                {/* Infos bas gauche — description 1 ligne + bouton Plus/Moins */}
                <div className="absolute bottom-4 left-4 right-20 lg:right-4 z-20 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={reel.user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold">{reel.user.username}</span>
                    <button className="text-blue-500 text-xs font-semibold ml-2">
                      Suivre
                    </button>
                  </div>

                  {/* Ligne description + bouton Plus/Moins */}
                  <div className="flex items-baseline gap-2 pr-2">
                    <p
                      className={
                        isExpanded
                          ? "text-sm leading-snug flex-1 min-w-0 whitespace-pre-wrap break-words"
                          : "text-sm leading-snug flex-1 min-w-0 truncate"
                      }
                    >
                      {reel.description}
                    </p>

                    {isLong && (
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        onClick={() => toggleExpand(reel.id)}
                        className="text-xs text-white/80 hover:text-white focus:outline-none"
                      >
                        {isExpanded ? "Moins" : "Plus"}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-gray-300">{reel.audio}</p>
                </div>

                {/* Colonne d'actions superposée (MOBILE seulement) */}
                <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-5 z-20 lg:hidden">
                  <button
                    type="button"
                    aria-label={likedMap[reel.id] ? "Retirer le like" : "Liker"}
                    className="flex flex-col items-center"
                    onClick={() => toggleLike(reel.id)}
                  >
                    {likedMap[reel.id] ? (
                      <FaHeart className="text-2xl text-red-500" />
                    ) : (
                      <FaRegHeart className="text-2xl" />
                    )}
                    <span className="text-xs mt-1">
                      {formatCompact(reel.likes)}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Ouvrir les commentaires"
                    className="flex flex-col items-center"
                    onClick={() => openComments(reel)}
                  >
                    <FaRegComment className="text-2xl" />
                    <span className="text-xs mt-1">{reel.comments}</span>
                  </button>

                  <button type="button" aria-label="Partager">
                    <FiSend className="text-2xl" />
                  </button>
                  <button type="button" aria-label="Enregistrer">
                    <FaRegBookmark className="text-2xl" />
                  </button>
                  <button type="button" aria-label="Plus d'options">
                    <FaEllipsisH className="text-xl" />
                  </button>

                  <img
                    src={reel.user.avatar}
                    alt="avatar"
                    className="w-8 h-8 border border-white rounded-full"
                  />
                </div>
              </div>

              {/* === COLONNE D'ACTIONS À DROITE (DESKTOP lg+) — en dehors de la vidéo === */}
              <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-end lg:ml-4 lg:h-[640px]">
                <div className="flex flex-col items-center space-y-5">
                  <button
                    type="button"
                    aria-label={likedMap[reel.id] ? "Retirer le like" : "Liker"}
                    className="flex flex-col items-center"
                    onClick={() => toggleLike(reel.id)}
                  >
                    {likedMap[reel.id] ? (
                      <FaHeart className="text-2xl text-red-500" />
                    ) : (
                      <FaRegHeart className="text-2xl" />
                    )}
                    <span className="text-xs mt-1">
                      {formatCompact(reel.likes)}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Ouvrir les commentaires"
                    className="flex flex-col items-center"
                    onClick={() => openComments(reel)}
                  >
                    <FaRegComment className="text-2xl" />
                    <span className="text-xs mt-1">{reel.comments}</span>
                  </button>

                  <button type="button" aria-label="Partager">
                    <FiSend className="text-2xl" />
                  </button>
                  <button type="button" aria-label="Enregistrer">
                    <FaRegBookmark className="text-2xl" />
                  </button>
                  <button type="button" aria-label="Plus d'options">
                    <FaEllipsisH className="text-xl" />
                  </button>

                  <img
                    src={reel.user.avatar}
                    alt="avatar"
                    className="w-8 h-8 border border-white rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modale des commentaires */}
      {isCommentsOpen && currentReelForComments && (
        <CommentModal
          user={currentReelForComments.user}
          onClose={closeComments}
          height="half"
        />
      )}
    </div>
  );
}
