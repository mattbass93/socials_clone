import { useEffect, useState, useRef } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { faker } from "@faker-js/faker";

function CommentModal({ user, onClose, height = "full" }) {
  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [inputText, setInputText] = useState("");
  const startYRef = useRef(0);

  useEffect(() => {
    const generatedComments = Array.from({ length: 30 }, (_, i) => {
      const hasReplies = Math.random() < 0.5;
      let replies = [];

      if (hasReplies) {
        replies = Array.from(
          { length: faker.number.int({ min: 1, max: 5 }) },
          (_, j) => ({
            id: `${i}-${j}`,
            username: faker.internet.userName(),
            avatar: faker.image.avatar(),
            text: faker.lorem.sentence(),
            likes: faker.number.int({ min: 5, max: 500 }),
            timestamp: faker.date.recent({ days: 14 }),
            liked: false,
          })
        );
      }

      return {
        id: i,
        username: faker.internet.userName(),
        avatar: faker.image.avatar(),
        text: faker.lorem.sentence(),
        likes: faker.number.int({ min: 20, max: 3000 }),
        timestamp: faker.date.recent({ days: 14 }),
        replies,
        showReplies: false,
        liked: false,
      };
    });

    setComments(generatedComments);
  }, []);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollY = el.scrollTop;
    const scrollMax = el.scrollHeight - el.clientHeight;
    if (scrollY >= scrollMax + 40) onClose();
  };

  // Drag (mobile)
  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) setDragOffset(deltaY);
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 100) onClose();
    else setDragOffset(0);
  };

  const handleEmojiClick = (emoji) => {
    setInputText((prev) => prev + emoji);
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

  const toggleLike = (commentId, isReply = false, replyId = null) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          if (!isReply) {
            return {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            };
          } else {
            const updatedReplies = c.replies.map((r) =>
              r.id === replyId
                ? {
                    ...r,
                    liked: !r.liked,
                    likes: r.liked ? r.likes - 1 : r.likes + 1,
                  }
                : r
            );
            return { ...c, replies: updatedReplies };
          }
        }
        return c;
      })
    );
  };

  const handleAddReply = () => {
    if (!inputText.trim()) return;

    const newCommentOrReply = {
      id: `${Date.now()}`,
      username: user.username,
      avatar: user.avatar,
      text: inputText.trim(),
      likes: 0,
      timestamp: new Date(),
      liked: false,
      replies: [],
      showReplies: false,
    };

    if (replyTo !== null) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyTo
            ? {
                ...c,
                replies: [...(c.replies || []), newCommentOrReply],
                showReplies: true,
              }
            : c
        )
      );
    } else {
      setComments((prev) => [...prev, newCommentOrReply]);
    }

    setInputText("");
    setReplyTo(null);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => el && el.removeEventListener("scroll", handleScroll);
  }, []);

  const heightClass =
    height === "half" ? "h-1/2 max-h-[50%]" : "h-full max-h-full";

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/30      /* léger voile comme Instagram */
        flex
        justify-center items-end
        lg:justify-end lg:items-center
      "
      // Fermer en cliquant sur le voile (desktop & mobile)
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-[#1c1c1e] w-full ${heightClass}
          rounded-t-2xl
          flex flex-col overflow-hidden
          /* --- Desktop (panneau latéral) --- */
          lg:w-[420px] lg:h-full lg:max-h-full
          lg:rounded-2xl lg:mr-4
          lg:border lg:border-gray-700
          lg:shadow-2xl
        `}
        style={{
          // Le translateY n’a d’effet que sur mobile (drag)
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        // Évite de fermer quand on clique à l’intérieur
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`
            w-full py-3 border-b border-gray-700
            flex flex-col items-center relative
            touch-none
            /* poignée visible uniquement sur mobile */
          `}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-gray-600 mb-1 lg:hidden"></div>
          <h3 className="text-white font-semibold text-center">Commentaires</h3>

          {/* Bouton fermer (affiché sur desktop) */}
          <button
            className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            onClick={onClose}
            aria-label="Fermer"
            title="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Pour vous */}
        <div className="text-sm text-gray-400 px-4 py-2 border-b border-gray-700">
          <span className="font-semibold text-white">Pour vous</span>
        </div>

        {/* Liste des commentaires */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
        >
          {comments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <div className="flex space-x-3">
                <div className="relative">
                  <div className="p-[2px] bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-full">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">
                      {comment.username}
                    </p>
                    <span className="text-xs text-gray-400">
                      · {getTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-white text-sm mt-1">{comment.text}</p>
                  <div className="text-xs text-gray-400 flex space-x-4 mt-2">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() => setReplyTo(comment.id)}
                    >
                      Répondre
                    </span>
                  </div>

                  {/* Toggle réponses */}
                  {comment.replies.length > 0 && (
                    <div
                      className="text-xs text-gray-400 mt-2 cursor-pointer hover:underline"
                      onClick={() =>
                        setComments((prev) =>
                          prev.map((c) =>
                            c.id === comment.id
                              ? { ...c, showReplies: !c.showReplies }
                              : c
                          )
                        )
                      }
                    >
                      {comment.showReplies
                        ? "Masquer les réponses"
                        : `Voir ${comment.replies.length} réponse${
                            comment.replies.length > 1 ? "s" : ""
                          }`}
                    </div>
                  )}
                </div>

                <div
                  className="flex flex-col items-center text-xs text-gray-400 cursor-pointer select-none"
                  onClick={() => toggleLike(comment.id)}
                >
                  {comment.liked ? (
                    <FaHeart className="text-sm text-red-500" />
                  ) : (
                    <FaRegHeart className="text-sm" />
                  )}
                  <span>{comment.likes}</span>
                </div>
              </div>

              {/* Réponses */}
              {comment.showReplies &&
                comment.replies.map((reply) => (
                  <div key={reply.id} className="flex space-x-3 mt-4 ml-10">
                    <div>
                      <img
                        src={reply.avatar}
                        alt={reply.username}
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold text-sm">
                          {reply.username}
                        </p>
                        <span className="text-xs text-gray-400">
                          · {getTimeAgo(reply.timestamp)}
                        </span>
                      </div>
                      <p className="text-white text-sm mt-1">{reply.text}</p>
                      <div className="text-xs text-gray-400 flex space-x-4 mt-2">
                        <span
                          className="cursor-pointer hover:underline"
                          onClick={() => setReplyTo(comment.id)}
                        >
                          Répondre
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex flex-col items-center text-xs text-gray-400 cursor-pointer select-none"
                      onClick={() => toggleLike(comment.id, true, reply.id)}
                    >
                      {reply.liked ? (
                        <FaHeart className="text-sm text-red-500" />
                      ) : (
                        <FaRegHeart className="text-sm" />
                      )}
                      <span>{reply.likes}</span>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Barre d’emojis */}
        <div className="w-full px-4 py-2 border-t border-gray-700 flex gap-2 overflow-x-auto text-2xl">
          {["❤️", "🙌", "🔥", "💚", "🖤", "😍", "🤍", "😂"].map(
            (emoji, idx) => (
              <span
                key={idx}
                className="cursor-pointer"
                onClick={() => handleEmojiClick(emoji)}
              >
                {emoji}
              </span>
            )
          )}
        </div>

        {/* Champ d’ajout */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-700">
          <img src={user.avatar} alt="me" className="w-8 h-8 rounded-full" />
          <input
            type="text"
            placeholder={
              replyTo !== null
                ? `Répondre à @${
                    comments.find((c) => c.id === replyTo)?.username
                  }`
                : "Ajoutez un commentaire pour réagir..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddReply()}
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
          />
          {inputText.trim() !== "" ? (
            <button className="text-white text-xl" onClick={handleAddReply}>
              ➤
            </button>
          ) : (
            <>
              <button className="text-white text-xl" title="GIF">
                GIF
              </button>
              <button className="text-white text-xl" title="Cadeau">
                🎁
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
