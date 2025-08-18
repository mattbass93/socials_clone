import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Story from "./Story";

function StoriesCarousel({ users }) {
  const visibleCount = 6;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(users.length / visibleCount);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6 overflow-hidden">
      {/* Tabs */}
      <div className="flex space-x-6 mb-4">
        <span className="text-white font-semibold cursor-pointer hover:underline">
          Pour Vous
        </span>
        <span className="text-gray-400 cursor-pointer hover:underline">
          Suivi(e)
        </span>
      </div>

      {/* Carousel */}
      <div className="relative pt-4 border-t border-gray-700">
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-400 ease-in-out"
            style={{
              transform: `translateX(-${page * 100}%)`,
              width: `${totalPages * 100}%`,
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <div
                key={i}
                className="flex space-x-2 w-full px-1 shrink-0 justify-start"
              >
                {users
                  .slice(i * visibleCount, i * visibleCount + visibleCount)
                  .map((user, index) => (
                    <div key={index} className=" flex-shrink-0">
                      <Story
                        username={user.login.username}
                        avatar={user.picture.thumbnail}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white disabled:opacity-30 p-1 bg-black bg-opacity-50 rounded-full"
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        {/* Flèche droite */}
        <button
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white disabled:opacity-30 p-1 bg-black bg-opacity-50 rounded-full"
        >
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default StoriesCarousel;
