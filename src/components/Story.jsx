function Story({ username, avatar }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <img
        src={avatar}
        alt={username}
        className="w-14 h-14 rounded-full border-2 border-pink-500 p-1 hover:scale-105 transition"
      />
      <span className="text-xs text-white mt-1">{username}</span>
    </div>
  );
}

export default Story;
