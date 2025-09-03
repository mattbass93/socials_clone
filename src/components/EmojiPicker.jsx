import React, { useEffect, useRef } from "react";

/**
 * Mini-modale d’emojis scrollable.
 * Props:
 * - onSelect(emoji: string)
 * - onClose()
 * - className (optionnelle) pour positionnement (ex: "absolute right-0 top-10")
 */
export default function EmojiPicker({ onSelect, onClose, className = "" }) {
  const ref = useRef(null);

  // Fermer au clic en dehors
  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onClose]);

  // Jeu d’emojis (populaires + activités, etc.)
  const emojis = [
    // Populaires
    "😂",
    "🤣",
    "😍",
    "🥰",
    "😘",
    "😅",
    "😮",
    "👏",
    "🔥",
    "🎉",
    "💯",
    "💖",
    "🥳",
    "😎",
    "🤩",
    "😊",
    "👍",
    // Visages
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "🙂",
    "😉",
    "😌",
    "😏",
    "🙃",
    "😇",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "😐",
    "😑",
    "😴",
    "😪",
    "😵",
    "🤯",
    "😕",
    "😟",
    "🙁",
    "😮‍💨",
    "😢",
    "😭",
    "😤",
    "😡",
    "🤬",
    "🤒",
    "🤕",
    "🤧",
    "🤢",
    "🤮",
    // Gestes
    "👍",
    "👎",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "👏",
    "🙌",
    "🙏",
    "💪",
    "🫶",
    "🫰",
    "👋",
    "🤙",
    "✊",
    "👊",
    // Cœurs
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💞",
    "💟",
    "❣️",
    // Activités / sports
    "⛷️",
    "🏂",
    "🏌️",
    "🏇",
    "🏊",
    "🏄",
    "🚣",
    "🏋️",
    "🤸",
    "🤺",
    "🚴",
    "🚵",
    "🧗",
    "🤽",
    "🤾",
    "🏌️‍♀️",
    "🏄‍♂️",
    // Objets / autres
    "🎁",
    "🎈",
    "🎂",
    "🍕",
    "🍔",
    "🍟",
    "🍣",
    "🍩",
    "☕",
    "🍺",
    "🍻",
    "🍷",
    "🌟",
    "✨",
    "⚡",
    "🎵",
    "🎶",
    "📸",
    "🎮",
  ];

  return (
    <div
      role="dialog"
      aria-label="Sélecteur d’emojis"
      className={[
        "z-50 w-64 max-h-64 rounded-xl border border-gray-700 bg-neutral-900 shadow-lg",
        "p-2",
        "flex flex-col",
        className,
      ].join(" ")}
      ref={ref}
    >
      <div className="text-xs text-gray-400 px-1 pb-1">Emojis</div>
      <div className="overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((e, i) => (
            <button
              key={i}
              type="button"
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-800 transition text-lg"
              onClick={() => {
                onSelect?.(e);
              }}
            >
              <span aria-hidden="true">{e}</span>
              <span className="sr-only">Emoji {e}</span>
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 text-xs text-gray-400 hover:text-gray-200 self-end"
      >
        Fermer
      </button>
    </div>
  );
}
