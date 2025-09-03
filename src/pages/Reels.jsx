import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { FiSend, FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { fetchVideos, fetchUsers } from "../services/api";
import CommentModal from "../components/CommentModal";
import SendModal from "../components/SendModal";
import BottomSheet from "../components/BottomSheet";

// Hook utilitaire : savoir si on est en >= lg (1024px)
function useIsLgUp() {
  const [isLgUp, setIsLgUp] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsLgUp(e.matches);
    setIsLgUp(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isLgUp;
}

export default function Reels() {
  const [reelsData, setReelsData] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [currentReelForComments, setCurrentReelForComments] = useState(null);

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // --- BottomSheet "Plus" ---
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // --- Bookmark / Miniature flottante (version mobile uniquement) ---
  const [bookmarkedMap, setBookmarkedMap] = useState({});
  const [showMiniPreview, setShowMiniPreview] = useState(false);
  const [miniPreviewSrc, setMiniPreviewSrc] = useState("");
  const [animIn, setAnimIn] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const timerEnterRef = useRef(null);
  const timerExitStartRef = useRef(null);
  const timerExitHideRef = useRef(null);

  const isLgUp = useIsLgUp();

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

            const thumbnail =
              video.image ||
              video.video_pictures?.[0]?.picture ||
              video.video_pictures?.[0]?.nr ||
              null;

            return {
              id: video.id,
              url,
              thumbnail,
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
        setAllUsers(users);
      } catch (error) {
        console.error("Erreur lors du chargement des Reels :", error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (timerEnterRef.current) clearTimeout(timerEnterRef.current);
      if (timerExitStartRef.current) clearTimeout(timerExitStartRef.current);
      if (timerExitHideRef.current) clearTimeout(timerExitHideRef.current);
    };
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

  const openSend = () => setIsSendOpen(true);
  const closeSend = () => setIsSendOpen(false);

  // --- BottomSheet handlers ---
  const openMore = () => setIsMoreOpen(true);
  const closeMore = () => setIsMoreOpen(false);

  // --- Miniature animée (déclenchée uniquement si < lg) ---
  const triggerMiniPreview = (src) => {
    if (!src) return;
    setMiniPreviewSrc(src);
    setShowMiniPreview(true);
    setDisappearing(false);
    setAnimIn(false);

    if (timerEnterRef.current) clearTimeout(timerEnterRef.current);
    timerEnterRef.current = setTimeout(() => setAnimIn(true), 0);

    if (timerExitStartRef.current) clearTimeout(timerExitStartRef.current);
    timerExitStartRef.current = setTimeout(() => {
      setDisappearing(true);
      setAnimIn(false);

      if (timerExitHideRef.current) clearTimeout(timerExitHideRef.current);
      timerExitHideRef.current = setTimeout(() => {
        setShowMiniPreview(false);
        setDisappearing(false);
        setMiniPreviewSrc("");
      }, 300);
    }, 1700);
  };

  // --- Bookmark (icône blanche + mini preview mobile uniquement) ---
  const toggleBookmark = (reel) => {
    setBookmarkedMap((prev) => {
      const next = !prev[reel.id];

      // Miniature uniquement sur mobile (< lg)
      if (next && !isLgUp) {
        const miniSrc = reel?.thumbnail || reel?.poster || reel?.url || "";
        triggerMiniPreview(miniSrc);
      }

      return { ...prev, [reel.id]: next };
    });
  };

  const isBookmarked = useMemo(
    () => (id) => !!bookmarkedMap[id],
    [bookmarkedMap]
  );

  return (
    <div className="w-full h-screen mx-auto bg-black text-white relative overflow-hidden">
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
              <div className="relative w-full h-full lg:w-[382px] lg:h-[640px]">
                <video
                  src={reel.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={reel.thumbnail || undefined}
                  className="absolute inset-0 h-full w-full object-cover bg-black z-0"
                />

                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10" />

                <div className="absolute bottom-18 lg:bottom-4 left-4 right-20 lg:right-4 z-20 text-sm space-y-2">
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

                {/* Mobile actions */}
                <div className="absolute bottom-18 right-4 flex flex-col items-center space-y-5 z-20 lg:hidden">
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

                  <button
                    type="button"
                    aria-label="Partager"
                    onClick={openSend}
                  >
                    <FiSend className="text-2xl" />
                  </button>

                  {/* Bookmark */}
                  <button
                    type="button"
                    aria-label={
                      isBookmarked(reel.id)
                        ? "Retirer des favoris"
                        : "Enregistrer"
                    }
                    onClick={() => toggleBookmark(reel)}
                    className="cursor-pointer"
                    title={
                      isBookmarked(reel.id)
                        ? "Retirer des favoris"
                        : "Enregistrer"
                    }
                  >
                    {isBookmarked(reel.id) ? (
                      <FaBookmark className="text-2xl text-white" />
                    ) : (
                      <FaRegBookmark className="text-2xl" />
                    )}
                  </button>

                  {/* Icône verticale pour mobile -> BottomSheet */}
                  <button
                    type="button"
                    aria-label="Plus d'options"
                    onClick={openMore}
                  >
                    <FiMoreVertical className="text-xl" />
                  </button>

                  <img
                    src={reel.user.avatar}
                    alt="avatar"
                    className="w-8 h-8 border border-white rounded-full"
                  />
                </div>
              </div>

              {/* Desktop actions */}
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

                  <button
                    type="button"
                    aria-label="Partager"
                    onClick={openSend}
                  >
                    <FiSend className="text-2xl" />
                  </button>

                  {/* Bookmark */}
                  <button
                    type="button"
                    aria-label={
                      isBookmarked(reel.id)
                        ? "Retirer des favoris"
                        : "Enregistrer"
                    }
                    onClick={() => toggleBookmark(reel)}
                    className="cursor-pointer"
                    title={
                      isBookmarked(reel.id)
                        ? "Retirer des favoris"
                        : "Enregistrer"
                    }
                  >
                    {isBookmarked(reel.id) ? (
                      <FaBookmark className="text-2xl text-white" />
                    ) : (
                      <FaRegBookmark className="text-2xl" />
                    )}
                  </button>

                  {/* Icône horizontale pour desktop -> BottomSheet */}
                  <button
                    type="button"
                    aria-label="Plus d'options"
                    onClick={openMore}
                  >
                    <FiMoreHorizontal className="text-xl" />
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

      {isCommentsOpen && currentReelForComments && (
        <CommentModal
          user={currentReelForComments.user}
          onClose={closeComments}
          height="half"
        />
      )}

      {isSendOpen && <SendModal onClose={closeSend} users={allUsers} />}

      {/* BottomSheet "Plus" — maquette, sans logique d’actions */}
      <BottomSheet open={isMoreOpen} onClose={closeMore} />

      {/* Miniature flottante animée — visible uniquement sur mobile */}
      {showMiniPreview && miniPreviewSrc && (
        <div className="fixed bottom-8 right-0 flex justify-center pointer-events-none z-50 lg:hidden">
          <div
            className={[
              "transform-gpu transition-all duration-300 ease-in-out",
              !animIn && !disappearing
                ? "opacity-0 scale-70 translate-y-2"
                : "",
              animIn && !disappearing
                ? "opacity-100 scale-80 translate-y-0"
                : "",
              disappearing ? "opacity-0 scale-70 translate-y-6" : "",
            ].join(" ")}
          >
            <img
              src={miniPreviewSrc}
              alt="Aperçu enregistré"
              className="w-16 h-16 object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}
