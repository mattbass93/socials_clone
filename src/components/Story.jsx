import { FaRegUserCircle } from "react-icons/fa";

/**
 * Props:
 * - username: string
 * - avatar?: string
 * - isSelf?: boolean
 * - onClick: () => void
 */
function Story({ username, avatar, isSelf, onClick }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className="flex flex-col items-center
    w-1/4 min-w-[72px] max-w-[110px] sm:w-1/5 sm:min-w-[90px] sm:max-w-[130px] md:w-1/6 md:min-w-[100px] md:max-w-[140px] lg:w-20"
    >
      {isSelf ? (
        // "Votre Story" → pas de hover/click
        <div className="rounded-full">
          <FaRegUserCircle className="text-gray-500 text-5xl bg-gray-100 rounded-full w-16 h-16" />
        </div>
      ) : (
        // Autres users → dégradé + clic
        <div
          role="button"
          aria-label={`Voir la story de ${username}`}
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          className="cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-500/60 rounded-full"
        >
          <div className="rounded-full p-[3px] bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4] w-16 h-16">
            <div className="bg-black p-[2px] rounded-full w-full h-full flex items-center justify-center">
              <img
                src={avatar}
                alt={username}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      )}

      <span className="text-xs text-white mt-1 truncate w-16 text-center">
        {username}
      </span>
    </div>
  );
}

export default Story;
