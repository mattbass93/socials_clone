import {
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaRegSmile,
} from "react-icons/fa";
import { FiSend, FiMoreHorizontal } from "react-icons/fi";

function Post({ user, media, description }) {
  return (
    <div className="w-120 ml-auto mr-auto transition mb-6 bg-black p-4 text-white border-b border-gray-700">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <span className="font-semibold">{user.username}</span>
          <span className="text-xs text-gray-400">· 21h</span>
        </div>
        <FiMoreHorizontal className="text-xl cursor-pointer" />
      </div>

      {/* Media (image ou vidéo) */}
      <div className="overflow-hidden rounded-lg mb-3">
        {media.type === "image" ? (
          <img
            src={media.url}
            alt={media.alt || "Post"}
            className="w-full object-cover hover:scale-105 transition duration-300"
          />
        ) : (
          <video
            src={media.url}
            poster={media.thumbnail}
            controls
            muted
            className="w-full object-cover max-h-[600px]"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4">
          <FaRegHeart className="text-2xl cursor-pointer" />
          <FaRegComment className="text-2xl cursor-pointer" />
          <FiSend className="text-2xl cursor-pointer" />
        </div>
        <FaRegBookmark className="text-2xl cursor-pointer" />
      </div>

      {/* Likes */}
      <div className="text-sm font-semibold mb-2">
        {Math.floor(Math.random() * 500)} J'aime
      </div>

      {/* Description */}
      <div className="text-sm mb-2">
        <span className="font-semibold mr-2">{user.username}</span>
        <span className="line-clamp-2">{description}</span>
      </div>

      {/* Voir commentaires */}
      <div className="text-sm text-gray-400 cursor-pointer mb-2 hover:underline">
        Afficher les 25 commentaires
      </div>

      {/* Ajouter un commentaire */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Ajouter un commentaire..."
          className="pt-3 flex-1 bg-transparent outline-none placeholder-gray-500 text-sm"
        />
        <FaRegSmile className="text-xl ml-3 cursor-pointer" />
      </div>
    </div>
  );
}

export default Post;
