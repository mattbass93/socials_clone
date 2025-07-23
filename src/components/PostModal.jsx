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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [description, setDescription] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [hashtags, setHashtags] = useState([]);

  const modalRef = useRef(null);

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
        week: Math.floor(Math.random() * 50),
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
    }
  }, [media]);

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

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          user: "vous",
          avatar: faker.image.avatar(),
          text: newComment,
          likes: 0,
          liked: false,
        },
      ]);
      setNewComment("");
    }
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
        className="w-full max-w-7xl h-[95vh] flex rounded-lg overflow-hidden"
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
            <BsThreeDots className="text-xl cursor-pointer" />
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
                      <span>{c.week} sem</span>
                      <span>{c.likes} j'aime</span>
                      <span>Répondre</span>
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
              <FaRegComment className="text-2xl cursor-pointer" />
              <FiSend className="text-2xl cursor-pointer" />
            </div>
            <FaRegBookmark className="text-2xl cursor-pointer" />
          </div>

          {/* Likes */}
          <div className="text-sm font-semibold px-4 mb-2">
            {likeCount} j'aime
          </div>

          {/* Ajouter commentaire */}
          <div className="border-t border-gray-800 px-1 py-3 flex items-center gap-3">
            <FaRegSmile className="text-2xl ml-3 cursor-pointer" />
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              type="text"
              placeholder="Ajouter un commentaire..."
              className="bg-transparent outline-none placeholder-gray-400 flex-1 text-sm"
            />
            <span className="text-gray-400 ml-2 text-sm font-semibold cursor-pointer">
              Publier
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
