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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (media) {
      const generatedComments = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        user: faker.internet.username(),
        avatar: faker.image.avatar(),
        text: faker.lorem.sentence(5),
        timestamp: faker.date.recent({ days: 7 }), // ← date dans les 7 derniers jours
        likes: Math.floor(Math.random() * 300),
        liked: false,
      }));
      setComments(generatedComments);
      setNewComment("");
      setDescription(faker.lorem.sentence());
      setLikeCount(Math.floor(Math.random() * 1000));
      setIsLiked(false);
      setAuthorName(faker.name.firstName());
      setHashtags(Array.from({ length: 4 }, () => `#${faker.word.sample()}`));
      setPostDate(faker.date.recent({ days: 7 })); // ← nouvelle ligne
      setUserAvatar(faker.image.avatar());
    }
  }, [media]);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideOptions);
    };
  }, [showOptionsModal]);

  const handleReplyToUser = (username) => {
    setNewComment((prev) => {
      const mention = `@${username} `;
      // Si déjà présent, ne le duplique pas
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
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    );
  };

  const focusCommentInput = () => {
    commentInputRef.current?.focus();
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
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
    }
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
    setIsLiked(!isLiked);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
  };

  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <div
        ref={modalRef}
        className="w-full max-w-7xl h-[95vh] flex rounded-t-md overflow-hidden"
      >
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-white z-40"
        >
          <FaTimes />
        </button>

        {/* Flèches navigation */}
        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50"
        >
          <FaChevronLeft className="bg-white text-black rounded-full p-2 w-8 h-8" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50"
        >
          <FaChevronRight className="bg-white text-black rounded-full p-2 w-8 h-8" />
        </button>

        {/* Media */}
        <div className="w-[55%] flex items-center justify-center">
          {media.type === "video" ? (
            <video
              src={media.url}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={media.url}
              alt={media.alt}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Détails */}
        <div
          style={{ backgroundColor: "rgb(38, 38, 38)" }}
          className="w-[45%] text-white flex flex-col relative"
        >
          {/* Auteur + suivre */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <img
                src={`https://i.pravatar.cc/40?u=${media.alt}`}
                alt="auteur"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{authorName}</span>
              <span className="text-white text-2xl">·</span>
              <button className="text-sm text-blue-500 font-semibold">
                Suivre
              </button>
            </div>
            <BsThreeDots
              className="text-xl cursor-pointer"
              onClick={() => setShowOptionsModal(true)}
            />
          </div>

          {/* Description */}
          <div className="flex items-start px-4 py-3 border-b border-gray-800 text-sm">
            <img
              src={`https://i.pravatar.cc/40?u=${media.alt}`}
              className="w-8 h-8 rounded-full mr-3"
              alt="desc"
            />
            <div>
              <span className="font-semibold mr-2">{authorName}</span>
              <span>{description}</span>
              <div className="mt-1 space-x-2">
                {hashtags.map((tag, i) => (
                  <span key={i} className="text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Commentaires */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5 text-sm">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start justify-between">
                <div className="flex">
                  <img
                    src={c.avatar}
                    className="w-8 h-8 rounded-full mr-3"
                    alt="user"
                  />
                  <div>
                    <span className="font-semibold mr-2">{c.user}</span>
                    <span>{c.text}</span>
                    <div className="flex space-x-2 text-xs text-gray-400 mt-1">
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
          <div className="border-t border-gray-800 px-4 py-3 text-lg flex justify-between">
            <div className="flex space-x-4">
              <button onClick={toggleMainLike}>
                {isLiked ? (
                  <FaHeart className="text-2xl text-red-500" />
                ) : (
                  <FaRegHeart className="text-2xl" />
                )}
              </button>
              <button onClick={focusCommentInput}>
                <FaRegComment className="text-2xl cursor-pointer" />
              </button>
              <FiSend className="text-2xl cursor-pointer" />
            </div>
            <FaRegBookmark className="text-2xl cursor-pointer" />
          </div>

          {/* Likes */}
          <div className="text-sm font-semibold px-4 mb-2">
            {likeCount} j'aime
          </div>
          <div className="text-xs text-gray-400 px-4 mb-3">
            {getPostAge(postDate)}
          </div>

          {/* Ajouter commentaire */}
          <div className="border-t border-gray-800 px-1 py-3 flex items-center gap-3">
            <FaRegSmile className="text-2xl ml-3 cursor-pointer" />
            <input
              ref={commentInputRef} // 👈 Ajout ici
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              type="text"
              placeholder="Ajouter un commentaire..."
              className="bg-transparent outline-none placeholder-gray-400 flex-1 text-sm"
            />
            <span
              className="text-gray-400 ml-2 text-sm font-semibold cursor-pointer mr-2"
              onClick={handleAddComment} // ← ici
            >
              Publier
            </span>
          </div>

          {showOptionsModal && (
            <>
              <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50"
                onClick={() => setShowOptionsModal(false)}
              ></div>

              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  ref={optionsModalRef}
                  className="bg-[#262626] w-[550px] rounded-4xl overflow-hidden text-sm text-center font-medium text-white"
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
