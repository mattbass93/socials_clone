function Post({ user, photo }) {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition p-4 mb-6">
      {/* En-tête avec l'utilisateur */}
      <div className="flex items-center mb-4">
        <img
          src={user.avatar}
          alt={user.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold">{user.username}</p>
          <p className="text-xs text-gray-500">{user.location}</p>
        </div>
      </div>

      {/* Image du post */}
      <div className="overflow-hidden rounded-lg">
        <img
          src={photo.url}
          alt={photo.alt || "Post"}
          className="w-full object-cover hover:scale-105 transition"
        />
      </div>

      {/* Footer simple */}
      <div className="mt-3 text-sm text-gray-600">
        ❤️ {Math.floor(Math.random() * 500)} likes
      </div>
    </div>
  );
}

export default Post;
