import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiSend, FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import CommentModal from "./CommentModal";
import SendModal from "./SendModal";
import BottomSheet from "./BottomSheet";

// Génére un tableau de commentaires dynamiques (sans fallbackText)
function generateRandomComments(users, count = 5) {
  const shuffledUsers = [...users]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);

  return shuffledUsers.map((user) => ({
    username: user.username,
    avatar: user.avatar,
    likes: Math.floor(Math.random() * 1500),
  }));
}

// Génère un nombre de jours aléatoire entre 1 et 6
function getRandomDayCount() {
  return Math.floor(Math.random() * 6) + 1;
}

// Génère un nombre de likes aléatoire (par ex. 120 à 9 500)
function getRandomLikes() {
  return Math.floor(Math.random() * (9500 - 120 + 1)) + 120;
}

function Post({ user, media, description, users = [] }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);

  // Like
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(getRandomLikes());

  // Bookmark + animation miniature
  const [bookmarked, setBookmarked] = useState(false);
  const [showMiniPreview, setShowMiniPreview] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const timerEnterRef = useRef(null);
  const timerExitStartRef = useRef(null);
  const timerExitHideRef = useRef(null);

  // Menu « plus »
  const [isMoreOpen, setMoreOpen] = useState(false);

  const randomComments = useMemo(() => generateRandomComments(users), [users]);
  const dayCount = useMemo(() => getRandomDayCount(), []);
  const commentsCount = randomComments.length;

  const handleCommentClick = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleSendClick = () => setSendOpen(true);
  const handleSendClose = () => setSendOpen(false);

  const toggleLike = () => {
    setLikesCount((prev) => prev + (liked ? -1 : 1));
    setLiked((prev) => !prev);
  };

  const triggerMiniPreview = () => {
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
      }, 300);
    }, 1700);
  };

  const toggleBookmark = () => {
    if (!bookmarked) {
      setBookmarked(true);
      triggerMiniPreview();
    } else {
      setBookmarked(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerEnterRef.current) clearTimeout(timerEnterRef.current);
      if (timerExitStartRef.current) clearTimeout(timerExitStartRef.current);
      if (timerExitHideRef.current) clearTimeout(timerExitHideRef.current);
    };
  }, []);

  // Source miniature
  const miniSrc =
    media?.type === "image"
      ? media?.url
      : media?.thumbnail || media?.poster || media?.url;

  // Actions du sheet (branche ce que tu veux)
  const handleSheetAction = (id) => {
    switch (id) {
      case "save":
        toggleBookmark();
        break;
      // ajoute ici tes comportements selon les ids (remix, qr, unfollow, etc.)
      default:
        console.log("Action feuille:", id);
        break;
    }
    setMoreOpen(false);
  };

  return (
    <>
      {/* Post principal */}
      <div className="w-screen max-w-[468px] mx-auto transition mb-6 bg-black text-white border-b border-gray-700 rounded-none sm:rounded-lg">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
            />
            <span className="font-semibold text-sm sm:text-base">
              {user.username}
            </span>
            <span className="text-xs text-gray-400">· {dayCount} j</span>
          </div>
          <FiMoreVertical
            className="text-xl cursor-pointer block lg:hidden"
            onClick={() => setMoreOpen(true)}
            aria-label="Plus d'options"
          />
          <FiMoreHorizontal
            className="text-xl cursor-pointer hidden lg:block"
            onClick={() => setMoreOpen(true)}
            aria-label="Plus d'options"
          />
        </div>

        {/* Media */}
        <div className="overflow-hidden mb-3">
          {media?.type === "image" ? (
            <img
              src={media.url}
              alt={media.alt || "Post"}
              className="w-full object-cover transition duration-300 max-h-[450px] sm:max-h-[600px]"
            />
          ) : (
            <video
              src={media.url}
              poster={media.thumbnail}
              loop
              autoPlay
              muted
              playsInline
              preload="metadata"
              controls={false}
              controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
              disablePictureInPicture
              className="w-full object-cover max-h-[450px] sm:max-h-[600px]"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex items-center space-x-1 cursor-pointer select-none"
              aria-label="likes"
              onClick={toggleLike}
            >
              {liked ? (
                <FaHeart className="text-xl sm:text-2xl text-red-500" />
              ) : (
                <FaRegHeart className="text-xl sm:text-2xl" />
              )}
              <span className="text-sm sm:text-base tabular-nums">
                {likesCount.toLocaleString("fr-FR")}
              </span>
            </button>

            <button
              type="button"
              className="flex items-center space-x-1 cursor-pointer select-none"
              onClick={handleCommentClick}
              aria-label="commentaires"
            >
              <FaRegComment className="text-xl sm:text-2xl" />
              <span className="text-sm sm:text-base tabular-nums">
                {commentsCount}
              </span>
            </button>

            <FiSend
              className="text-xl sm:text-2xl cursor-pointer"
              onClick={handleSendClick}
            />
          </div>

          <button
            type="button"
            aria-label="enregistrer"
            onClick={toggleBookmark}
            className="cursor-pointer"
            title={bookmarked ? "Retirer des favoris" : "Enregistrer"}
          >
            {bookmarked ? (
              <FaBookmark className="text-xl sm:text-2xl text-white" />
            ) : (
              <FaRegBookmark className="text-xl sm:text-2xl" />
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="text-sm font-semibold mb-2 px-1">
          Aimé par <span className="font-semibold">{users[1]?.username}</span>{" "}
          et d'autres personnes
        </div>

        {/* Description */}
        <div className="text-sm mb-2 px-1">
          <span className="font-semibold mr-2">{user.username}</span>
          <span className="line-clamp-2">{description}</span>
        </div>
      </div>

      {/* Miniature flottante animée */}
      {showMiniPreview && miniSrc && (
        <div className="fixed bottom-8 right-0 flex justify-center pointer-events-none z-50">
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
              src={miniSrc}
              alt="Aperçu enregistré"
              className="w-16 h-16 object-cover"
            />
          </div>
        </div>
      )}

      {/* Modales existantes */}
      {isModalOpen && (
        <CommentModal
          user={user}
          comments={randomComments}
          onClose={handleModalClose}
        />
      )}
      {isSendOpen && <SendModal onClose={handleSendClose} />}

      {/* Feuille d’options */}
      <BottomSheet
        open={isMoreOpen}
        onClose={() => setMoreOpen(false)}
        onAction={handleSheetAction}
      />
    </>
  );
}

export default Post;
