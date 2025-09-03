import React from "react";

/**
 * ProfileStory (Highlight)
 * - Affiche une vignette de story (du MÊME utilisateur) avec un titre.
 * - Props:
 *   - image?: string  → image de couverture de la story
 *   - label: string   → titre de la story (ex: "Voyage")
 *   - isAdd?: boolean → style "Nouveau" avec un +
 */
function ProfileStory({ image, label, isAdd = false }) {
  if (isAdd) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border border-gray-600 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center text-2xl text-gray-400 leading-none">
            +
          </div>
        </div>
        <div className="text-xs mt-2 text-gray-400">{label}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]">
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              ?
            </div>
          )}
        </div>
      </div>
      <div className="text-xs mt-2 text-gray-300 truncate max-w-[80px] text-center">
        {label}
      </div>
    </div>
  );
}

export default ProfileStory;
