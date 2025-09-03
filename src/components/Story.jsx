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
    <div className="flex flex-col items-center w-auto">
      {isSelf ? (
        // "Votre Story" → pas de hover/click
        <div
          className="
            rounded-full
            w-17 h-17
            sm:w-[85px] sm:h-[85px]
            flex items-center justify-center
          "
        >
          <FaRegUserCircle className="text-gray-500 bg-gray-100 rounded-full w-full h-full" />
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
          <div
            className="
              rounded-full p-[3px] bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4]
              w-17 h-17 sm:w-[85px] sm:h-[85px]
            "
          >
            <div className="bg-black p-[2px] rounded-full w-full h-full flex items-center justify-center">
              <img
                src={avatar}
                alt={username}
                className="
                  rounded-full object-cover
                  w-full h-full
                "
              />
            </div>
          </div>
        </div>
      )}

      <span
        className="
          text-xs text-white mt-1 truncate
          w-16 sm:w-[74px]
          text-center
        "
      >
        {username}
      </span>
    </div>
  );
}

export default Story;
