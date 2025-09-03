import { useState, useRef, useEffect } from "react";
import {
  FiCamera,
  FiGrid,
  FiPlusSquare,
  FiBookmark,
  FiX,
} from "react-icons/fi";
import { BsStars, BsBroadcast } from "react-icons/bs";
import { FaHandsHelping } from "react-icons/fa";

function CreateModaleMobile({ onClose }) {
  const modalRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  // Fermer avec la touche Échap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Drag pour mobile uniquement (breakpoint < md)
  const isMobile = () =>
    window.matchMedia && window.matchMedia("(max-width: 767px)").matches;

  const handleTouchStart = (e) => {
    if (!isMobile()) return;
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isMobile() || !isDragging) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isMobile()) return;
    setIsDragging(false);
    if (dragOffset > 100) onClose?.();
    else setDragOffset(0);
  };

  // Fermer en cliquant en dehors
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 bg-transparent md:bg-black/60 flex justify-center items-end md:items-center z-50"
      onMouseDown={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div
        ref={modalRef}
        className="
          bg-[#1c1c1e]
          w-screen h-[60%] rounded-t-2xl
          md:rounded-2xl md:h-auto md:max-h-[80vh] md:w-[560px] md:max-w-[90%]
          flex flex-col overflow-hidden shadow-xl
        "
        style={{
          transform: isMobile() ? `translateY(${dragOffset}px)` : "none",
          transition:
            isMobile() && isDragging ? "none" : "transform 0.25s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="w-full py-3 border-b border-gray-700 flex items-center justify-center relative">
          {/* Poignée drag (mobile uniquement) */}
          <div className="w-10 h-1 rounded-full bg-gray-600 absolute top-2 md:hidden" />
          <h3
            id="create-modal-title"
            className="text-white font-semibold text-center"
          >
            Créer
          </h3>
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-3 top-2.5 text-white/80 hover:text-white transition"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Contenu */}
        <div
          className="
            px-4 py-2 overflow-y-auto
            flex flex-col space-y-4
            md:grid md:grid-cols-2 md:gap-4 md:space-y-0 md:p-4
          "
        >
          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <FiPlusSquare className="text-xl md:text-2xl" />
            <span className="font-medium">Reel</span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <FiGrid className="text-xl md:text-2xl" />
            <span className="font-medium">Publication</span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <FiCamera className="text-xl md:text-2xl" />
            <span className="font-medium">Story</span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <FiBookmark className="text-xl md:text-2xl" />
            <span className="font-medium">Story à la une</span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <BsBroadcast className="text-xl md:text-2xl" />
            <span className="font-medium">En direct</span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <BsStars className="text-xl md:text-2xl" />
            <span className="font-medium">IA</span>
            <span className="text-blue-500 text-xs font-semibold bg-gray-700/80 px-2 py-0.5 rounded-md ml-auto md:ml-2">
              NOUVEAU
            </span>
          </button>

          <button className="w-full flex items-center gap-3 text-gray-300 hover:text-white md:bg-[#232326] md:hover:bg-[#2a2a2c] md:rounded-xl md:p-4 md:justify-start md:h-20 md:shadow-sm transition">
            <FaHandsHelping className="text-xl md:text-2xl" />
            <span className="font-medium">Collecte de dons</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateModaleMobile;
