import { useState, useRef } from "react";
import { FiCamera, FiGrid, FiPlusSquare, FiBookmark } from "react-icons/fi";
import { BsStars, BsBroadcast } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";

function CreateModaleMobile({ onClose }) {
  const modalRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

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

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-end z-50">
      <div
        ref={modalRef}
        className="bg-[#1c1c1e] rounded-t-2xl w-full max-w-lg h-[60%] flex flex-col overflow-hidden"
        style={{
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="w-full py-3 border-b border-gray-700 flex flex-col items-center relative">
          <div className="w-10 h-1 rounded-full bg-gray-600 mb-1"></div>
          <h3 className="text-white font-semibold text-center">Créer</h3>
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-white text-2xl"
          ></button>
        </div>

        {/* Options List */}
        <div className="flex flex-col px-4 py-2 space-y-4">
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FiPlusSquare className="text-xl" />
            <span>Reel</span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FiGrid className="text-xl" />
            <span>Publication</span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FiCamera className="text-xl" />
            <span>Story</span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FiBookmark className="text-xl" />
            <span>Story à la une</span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <BsBroadcast className="text-xl" />
            <span>En direct</span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <BsStars className="text-xl" />
            <span>IA</span>
            <span className="text-blue-500 text-xs font-semibold bg-gray-700 px-2 py-0.5 rounded-md ml-auto">
              NOUVEAU
            </span>
          </button>
          <button className="flex items-center gap-3 text-gray-300 hover:text-white">
            <FaHandsHelping className="text-xl" />
            <span>Collecte de dons</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateModaleMobile;
