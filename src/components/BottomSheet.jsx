import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiStar,
  FiUserX,
  FiScissors,
  FiInfo,
  FiEyeOff,
  FiX,
  FiRepeat,
  FiFlag,
} from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";

function BottomSheet({ open, onClose }) {
  // Empêcher le scroll d’arrière-plan
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Fermer sur Échap
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (ev) => {
      if (ev.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // --- Drag state (touch) ---
  const startYRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const CLOSE_THRESHOLD = 120;

  const handleTouchStart = (ev) => {
    startYRef.current = ev.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (ev) => {
    if (!isDragging) return;
    const deltaY = ev.touches[0].clientY - startYRef.current;
    if (deltaY > 0) setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > CLOSE_THRESHOLD) {
      setDragOffset(window.innerHeight * 0.4);
      setTimeout(() => {
        setDragOffset(0);
        onClose?.();
      }, 180);
    } else {
      setDragOffset(0);
    }
  };

  if (!open) return null;

  const RowButton = ({ icon, label, danger = false }) => (
    <button
      type="button"
      className={`w-full flex items-center gap-3 px-4 py-4 text-[15px] sm:text-base text-left border-t border-gray-800 hover:bg-neutral-900 transition ${
        danger ? "text-red-500" : "text-white"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1">{label}</span>
    </button>
  );

  const TopAction = ({ icon, label }) => (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-2"
    >
      <div className="w-16 h-16 rounded-full bg-neutral-900 border border-gray-800 flex items-center justify-center">
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </button>
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 animate-fade-in"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={[
          "absolute bottom-0 left-0 right-0 bg-[#1c1c1e] text-white border-t border-gray-800 rounded-t-2xl",
          isDragging
            ? "transition-none"
            : "transition-transform duration-200 ease-out",
          "will-change-transform",
          "pb-[env(safe-area-inset-bottom)]",
        ].join(" ")}
        style={{ transform: `translateY(${dragOffset}px)` }}
      >
        {/* Poignée */}
        <div
          className="flex items-center justify-center pt-3 pb-1 select-none active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-1.5 w-12 rounded-full bg-neutral-700" />
        </div>

        {/* Rangée de 3 actions */}
        <div className="px-6 pt-3 pb-2">
          <div className="grid grid-cols-3 gap-6 justify-items-center">
            <TopAction icon={<FaRegBookmark />} label="Enregistrer" />
            <TopAction icon={<FiRepeat />} label="Remixer" />
            <TopAction icon={<BsQrCode />} label="Code QR" />
          </div>
        </div>

        {/* Liste d’options */}
        <div className="mt-2 max-h-[60vh] overflow-y-auto">
          <RowButton icon={<FiStar />} label="Ajouter aux favoris" />
          <RowButton icon={<FiUserX />} label="Ne plus suivre" />
          <RowButton icon={<FiScissors />} label="Créer un sticker découpé" />
          <RowButton
            icon={<FiInfo />}
            label="Pourquoi vous voyez cette publication"
          />
          <RowButton icon={<FiEyeOff />} label="Masquer" />
          <RowButton icon={<FiInfo />} label="À propos de ce compte" />
          <RowButton icon={<FiFlag />} label="Signaler" danger />
        </div>
      </div>

      <style>{`
        .animate-fade-in{animation:fadeIn .18s ease-out}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
    </div>,
    document.body
  );
}

export default BottomSheet;
