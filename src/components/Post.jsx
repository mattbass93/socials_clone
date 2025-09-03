import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiSend, FiMoreHorizontal, FiMoreVertical } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import CommentModal from "./CommentModal";
import SendModal from "./SendModal";
import BottomSheet from "./BottomSheet";
import EmojiPicker from "./EmojiPicker";

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

function getRandomDayCount() {
  return Math.floor(Math.random() * 6) + 1;
}
function getRandomLikes() {
  return Math.floor(Math.random() * (9500 - 120 + 1)) + 120;
}
function getRandomCommentsCount() {
  return Math.floor(Math.random() * (1200 - 12 + 1)) + 12;
}

function Post({ user, media, description, users = [] }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(getRandomLikes());

  const [bookmarked, setBookmarked] = useState(false);
  const [showMiniPreview, setShowMiniPreview] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const timerEnterRef = useRef(null);
  const timerExitStartRef = useRef(null);
  const timerExitHideRef = useRef(null);

  // lg: détection desktop pour désactiver l'animation de mini preview
  const [isDesktop, setIsDesktop] = useState(false);

  // Menu « plus »
  const [isMoreOpen, setMoreOpen] = useState(false);

  const randomComments = useMemo(() => generateRandomComments(users), [users]);
  const dayCount = useMemo(() => getRandomDayCount(), []);
  const commentsCount = randomComments.length;
  const desktopCommentsCount = useMemo(() => getRandomCommentsCount(), []);

  // Champ de saisie + emoji
  const [commentText, setCommentText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const emojiBtnWrapperRef = useRef(null);

  // --- Mobile: nom d'utilisateur fictif aléatoire pour "Aimé par ... et d'autres personnes"
  const fakeUsernames = useMemo(
    () => [
      "bluefrog22",
      "pixel_panda",
      "nova_kite",
      "astro_lemur",
      "citruswave",
      "m0onrabbit",
      "quietquokka",
      "emberleaf",
      "glitch_owl",
      "koriandair",
      "frenchtoffee",
      "zen_racoon",
      "echo_marmot",
      "saffronbyte",
      "lowpolyfox",
      "velvetmoss",
      "orbit_lynx",
      "prisme_noir",
      "neonfig",
      "luna_biscuit",
    ],
    []
  );
  const likedByName = useMemo(
    () => fakeUsernames[Math.floor(Math.random() * fakeUsernames.length)],
    [fakeUsernames]
  );
  // ---

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

  // A partir de lg:, on enlève l'animation de mini preview (juste l'icône se remplit)
  const toggleBookmark = () => {
    if (!bookmarked) {
      setBookmarked(true);
      if (!isDesktop) {
        // animation uniquement en < lg
        triggerMiniPreview();
      }
    } else {
      setBookmarked(false);
    }
  };

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    console.log("Nouveau commentaire:", text);
    setCommentText("");
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsEmojiOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
        submitComment();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commentText]);

  // Observer lg: pour activer/désactiver l'animation
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerEnterRef.current) clearTimeout(timerEnterRef.current);
      if (timerExitStartRef.current) clearTimeout(timerExitStartRef.current);
      if (timerExitHideRef.current) clearTimeout(timerExitHideRef.current);
    };
  }, []);

  const miniSrc =
    media?.type === "image"
      ? media?.url
      : media?.thumbnail || media?.poster || media?.url;

  const handleSheetAction = (id) => {
    switch (id) {
      case "save":
        toggleBookmark();
        break;
      default:
        console.log("Action feuille:", id);
        break;
    }
    setMoreOpen(false);
  };

  return (
    <>
      <div className="w-screen max-w-[468px] mx-auto transition mb-6 bg-black text-white lg:border-b border-gray-700 rounded-none sm:rounded-lg">
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
              <span className="text-sm sm:text-base tabular-nums lg:hidden">
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
              <span className="text-sm sm:text-base tabular-nums lg:hidden">
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
        {/* Mobile: utilise un username fictif aléatoire */}
        <div className="text-sm font-semibold mb-2 px-1 lg:hidden">
          Aimé par <span className="font-semibold">{likedByName}</span> et
          d'autres personnes
        </div>
        {/* Desktop: nombre total de likes */}
        <div className="hidden lg:block text-sm font-semibold mb-2 px-1">
          {likesCount.toLocaleString("fr-FR")} j'aime
        </div>

        {/* Description */}
        <div className="text-sm mb-2 px-1">
          <span className="font-semibold mr-2">{user.username}</span>
          <span className="line-clamp-2">{description}</span>
        </div>

        {/* Afficher commentaires */}
        <div className="hidden lg:block text-sm text-gray-300 mb-3 px-1">
          <button
            type="button"
            onClick={handleCommentClick}
            className="hover:text-gray-200"
          >
            Afficher {desktopCommentsCount.toLocaleString("fr-FR")} commentaires
          </button>
        </div>

        {/* Champ commentaire */}
        <div className="hidden lg:flex items-center gap-2 px-1 pb-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitComment();
              }
            }}
            placeholder="Ajouter un commentaire..."
            className="flex-1 bg-transparent text-sm placeholder-gray-500 focus:outline-none py-1"
          />

          {/* Publier visible seulement si texte */}
          {commentText.trim() && (
            <button
              type="button"
              onClick={submitComment}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              Publier
            </button>
          )}

          {/* Bouton emoji */}
          <div className="relative" ref={emojiBtnWrapperRef}>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-gray-800 transition"
              onClick={() => setIsEmojiOpen((v) => !v)}
            >
              <BsEmojiSmile className="text-sm" />
            </button>
            {isEmojiOpen && (
              <EmojiPicker
                onClose={() => setIsEmojiOpen(false)}
                onSelect={(emoji) => setCommentText((t) => t + emoji)}
                className="absolute right-0 top-10"
              />
            )}
          </div>
        </div>
      </div>

      {/* Mini preview (affichée uniquement si activée côté < lg) */}
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

      {/* Modales */}
      {isModalOpen && (
        <CommentModal
          user={user}
          comments={randomComments}
          onClose={handleModalClose}
        />
      )}
      {isSendOpen && <SendModal onClose={handleSendClose} />}

      <BottomSheet
        open={isMoreOpen}
        onClose={() => setMoreOpen(false)}
        onAction={handleSheetAction}
      />
    </>
  );
}

export default Post;
