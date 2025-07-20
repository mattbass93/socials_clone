function Story({ username, avatar }) {
  return (
    <div className="flex flex-col items-center w-full">
      <img
        src={avatar}
        alt={username}
        className="max-w-[60px] rounded-full border-2 border-pink-500 p-1"
      />
      <span className="text-xs text-white mt-1 text-center truncate w-full">
        {username}
      </span>
    </div>
  );
}

export default Story;
