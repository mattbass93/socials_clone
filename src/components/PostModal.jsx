import { useEffect, useState, useRef } from "react";

import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegSmile,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaRegBookmark,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { faker } from "@faker-js/faker";

function PostModal({ media, onClose, onNext, onPrev }) {
  const [userAvatar, setUserAvatar] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [description, setDescription] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const commentInputRef = useRef(null);
  const [postDate, setPostDate] = useState(null);

  const modalRef = useRef(null);
  const optionsModalRef = useRef(null);

  // Click extérieur -> fermer la modale (sauf sur les contrôles marqués data-modal-no-close)
  useEffect(() => {
    const handleClickOutside = (e) => {
      const target = e.target;
      if (!modalRef.current) return;

      // Si on clique sur un élément (ou un parent) marqué data-modal-no-close -> on ne ferme pas
      const clickOnControl = target.closest?.("[data-modal-no-close]");
      if (clickOnControl) return;

      // Si le clic est dans la modale -> ne pas fermer
      const clickInsideModal = modalRef.current.contains(target);
      if (clickInsideModal) return;

      // Sinon, clic réellement "extérieur"
      onClose?.();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Génération data factice
  useEffect(() => {
    if (!media) return;
    const generatedComments = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      user: faker.internet.username(),
      avatar: faker.image.avatar(),
      text: faker.lorem.sentence(5),
      timestamp: faker.date.recent({ days: 7 }),
      likes: Math.floor(Math.random() * 300),
      liked: false,
    }));
    setComments(generatedComments);
    setNewComment("");
    setDescription(faker.lorem.sentence());
    setLikeCount(Math.floor(Math.random() * 1000));
    setIsLiked(false);
    setAuthorName(faker.person.firstName());
    setHashtags(Array.from({ length: 4 }, () => `#${faker.word.sample()}`));
    setPostDate(faker.date.recent({ days: 7 }));
    setUserAvatar(faker.image.avatar());
  }, [media]);

  // Click extérieur sous-modale options
  useEffect(() => {
    const handleClickOutsideOptions = (e) => {
      if (
        showOptionsModal &&
        optionsModalRef.current &&
        !optionsModalRef.current.contains(e.target)
      ) {
        setShowOptionsModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideOptions);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideOptions);
  }, [showOptionsModal]);

  const handleReplyToUser = (username) => {
    setNewComment((prev) => {
      const mention = `@${username} `;
      return prev.startsWith(mention) ? prev : mention + prev;
    });
    commentInputRef.current?.focus();
  };

  const toggleLikeComment = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? Math.max(0, c.likes - 1) : c.likes + 1,
            }
          : c
      )
    );
  };

  const focusCommentInput = () => commentInputRef.current?.focus();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: "vous",
        avatar: userAvatar,
        text: newComment,
        likes: 0,
        liked: false,
        timestamp: new Date(),
      },
    ]);
    setNewComment("");
  };

  const getPostAge = (date) => {
    if (!date) return "";
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMin / 60);
    const diffD = Math.floor(diffH / 24);
    if (diffMin < 1) return "Il y a quelques secondes";
    if (diffMin < 60)
      return `Il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
    if (diffH < 24) return `Il y a ${diffH} heure${diffH > 1 ? "s" : ""}`;
    return `Il y a ${diffD} jour${diffD > 1 ? "s" : ""}`;
  };

  const getTimeAgo = (date) => {
    const diffMs = Date.now() - new Date(date).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "maintenant";
    if (diffMin < 60) return `${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} h`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD} j`;
  };

  const toggleMainLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
  };

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      {/* Bouton fermeture (fixé au viewport) */}
      <button
        data-modal-no-close
        onClick={onClose}
        className="fixed top-3 right-3 lg:top-4 lg:right-6 text-xl lg:text-2xl text-white z-[100] hover:opacity-80"
        aria-label="Fermer"
      >
        <FaTimes />
      </button>

      {/* Flèches (fixées au viewport) */}
      <button
        data-modal-no-close
        onClick={onPrev}
        className="fixed left-2 lg:left-4 top-1/2 -translate-y-1/2 z-[100]"
        aria-label="Précédent"
      >
        <FaChevronLeft className="bg-white text-black rounded-full p-2 w-9 h-9 lg:w-10 lg:h-10" />
      </button>
      <button
        data-modal-no-close
        onClick={onNext}
        className="fixed right-2 lg:right-4 top-1/2 -translate-y-1/2 z-[100]"
        aria-label="Suivant"
      >
        <FaChevronRight className="bg-white text-black rounded-full p-2 w-9 h-9 lg:w-10 lg:h-10" />
      </button>

      {/* Conteneur principal : mobile -> colonne ; desktop -> 2 colonnes */}
      <div
        ref={modalRef}
        className="
          w-full max-w-7xl
          h-screen lg:h-[95vh]
          flex flex-col lg:flex-row
          rounded-none lg:rounded-md
          overflow-hidden
          bg-transparent
        "
      >
        {/* MEDIA */}
        <div
          className="
            w-full lg:w-[55%]
            bg-black
            flex items-center justify-center
            h-[58vh] sm:h-[62vh] md:h-[66vh] lg:h-auto
          "
        >
          {media.type === "video" ? (
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full h-full object-contain lg:object-cover"
            />
          ) : (
            <img
              src={media.url}
              alt={media.alt}
              className="w-full h-full object-contain lg:object-cover"
            />
          )}
        </div>

        {/* DETAILS */}
        <div
          style={{ backgroundColor: "rgb(38, 38, 38)" }}
          className="
            w-full lg:w-[45%]
            text-white flex flex-col relative
            h-[42vh] sm:h-[38vh] md:h-[34vh] lg:h-auto
          "
        >
          {/* Header auteur */}
          <div className="flex items-center justify-between px-3 py-2.5 lg:px-4 lg:py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <img
                src={`https://i.pravatar.cc/40?u=${media.alt}`}
                alt="auteur"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
              />
              <span className="font-semibold text-sm lg:text-base">
                {authorName}
              </span>
              <span className="hidden lg:inline text-white text-2xl leading-none">
                ·
              </span>
              <button className="text-xs lg:text-sm text-blue-500 font-semibold">
                Suivre
              </button>
            </div>
            <BsThreeDots
              className="text-lg lg:text-xl cursor-pointer"
              onClick={() => setShowOptionsModal(true)}
            />
          </div>

          {/* Description */}
          <div className="flex items-start px-3 py-2 lg:px-4 lg:py-3 border-b border-gray-800 text-xs lg:text-sm">
            <img
              src={`https://i.pravatar.cc/40?u=${media.alt}`}
              className="w-7 h-7 lg:w-8 lg:h-8 rounded-full mr-2 lg:mr-3"
              alt="desc"
            />
            <div className="leading-snug">
              <span className="font-semibold mr-2">{authorName}</span>
              <span className="align-middle">{description}</span>
              <div className="mt-1 space-x-2">
                {hashtags.map((tag, i) => (
                  <span key={i} className="text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Commentaires (scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 py-2 lg:px-4 lg:py-3 space-y-3 lg:space-y-5 text-xs lg:text-sm">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between">
                <div className="flex">
                  <img
                    src={c.avatar}
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full mr-2 lg:mr-3"
                    alt="user"
                  />
                  <div>
                    <span className="font-semibold mr-2">{c.user}</span>
                    <span>{c.text}</span>
                    <div className="flex space-x-2 text-[10px] lg:text-xs text-gray-400 mt-1">
                      <span>{getTimeAgo(c.timestamp)}</span>
                      <span>{c.likes} j'aime</span>
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleReplyToUser(c.user)}
                      >
                        Répondre
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="text-xs text-gray-300 hover:text-white"
                  onClick={() => toggleLikeComment(c.id)}
                  aria-label={
                    c.liked ? "Retirer le j'aime" : "Aimer le commentaire"
                  }
                >
                  {c.liked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-800 px-3 lg:px-4 py-2 lg:py-3 text-base lg:text-lg flex justify-between">
            <div className="flex space-x-4">
              <button
                onClick={toggleMainLike}
                aria-label="Aimer la publication"
              >
                {isLiked ? (
                  <FaHeart className="text-xl lg:text-2xl text-red-500" />
                ) : (
                  <FaRegHeart className="text-xl lg:text-2xl" />
                )}
              </button>
              <button onClick={focusCommentInput} aria-label="Commenter">
                <FaRegComment className="text-xl lg:text-2xl cursor-pointer" />
              </button>
              <FiSend
                className="text-xl lg:text-2xl cursor-pointer"
                aria-label="Partager"
              />
            </div>
            <FaRegBookmark
              className="text-xl lg:text-2xl cursor-pointer"
              aria-label="Enregistrer"
            />
          </div>

          {/* Likes + date */}
          <div className="text-xs lg:text-sm font-semibold px-3 lg:px-4 mb-1">
            {likeCount} j'aime
          </div>
          <div className="text-[10px] lg:text-xs text-gray-400 px-3 lg:px-4 mb-2">
            {getPostAge(postDate)}
          </div>

          {/* Ajout commentaire */}
          <div className="border-t border-gray-800 px-2 lg:px-3 py-2 lg:py-3 flex items-center gap-2 lg:gap-3">
            <FaRegSmile className="text-lg lg:text-2xl ml-1 lg:ml-3 cursor-pointer" />
            <input
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              type="text"
              placeholder="Ajouter un commentaire..."
              className="bg-transparent outline-none placeholder-gray-400 flex-1 text-xs lg:text-sm"
            />
            <span
              className="text-blue-500 ml-1 lg:ml-2 text-xs lg:text-sm font-semibold cursor-pointer mr-1 lg:mr-2"
              onClick={handleAddComment}
            >
              Publier
            </span>
          </div>

          {/* Sous-modale options */}
          {showOptionsModal && (
            <>
              <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-[70]"
                onClick={() => setShowOptionsModal(false)}
              />
              <div className="fixed inset-0 z-[80] flex items-center justify-center px-3">
                <div
                  ref={optionsModalRef}
                  className="bg-[#262626] w-full max-w-[550px] rounded-2xl overflow-hidden text-sm text-center font-medium text-white"
                >
                  <div className="py-3 border-b border-[#3a3a3a] text-red-500 font-bold cursor-pointer hover:bg-[#333]">
                    Signaler
                  </div>
                  <div className="py-3 border-b border-[#3a3a3a] cursor-pointer hover:bg-[#333]">
                    Accéder à la publication
                  </div>
                  <div className="py-3 border-b border-[#3a3a3a] cursor-pointer hover:bg-[#333]">
                    Partager sur...
                  </div>
                  <div className="py-3 border-b border-[#3a3a3a] cursor-pointer hover:bg-[#333]">
                    Copier le lien
                  </div>
                  <div className="py-3 border-b border-[#3a3a3a] cursor-pointer hover:bg-[#333]">
                    Intégrer
                  </div>
                  <div className="py-3 border-b border-[#3a3a3a] cursor-pointer hover:bg-[#333]">
                    À propos de ce compte
                  </div>
                  <div
                    className="py-3 cursor-pointer hover:bg-[#333]"
                    onClick={() => setShowOptionsModal(false)}
                  >
                    Annuler
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostModal;
