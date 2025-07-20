import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Story from "./Story";

function StoriesCarousel({ users }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 6;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + visibleCount < users.length ? prev + visibleCount : prev
    );
  };

  const visibleUsers = users.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      {/* Les deux span alignés au début du carousel */}
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
        <div className="flex space-x-2 overflow-hidden">
          {visibleUsers.map((user, index) => (
            <Story
              key={index}
              username={user.login.username}
              avatar={user.picture.thumbnail}
            />
          ))}
        </div>

        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white disabled:opacity-30 p-1 bg-black bg-opacity-50 rounded-full"
        >
          <FiChevronLeft className="text-3xl" />
        </button>

        {/* Flèche droite */}
        <button
          onClick={handleNext}
          disabled={startIndex + visibleCount >= users.length}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white disabled:opacity-30 p-1 bg-black bg-opacity-50 rounded-full"
        >
          <FiChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default StoriesCarousel;
