import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiSend,
  FiSearch,
} from "react-icons/fi";

/**
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - initialUser: { login?: { username?: string } } | null
 * - initialStories: Array<{ type: "image" | "video", url: string, duration?: number }>
 * - onRequestNextUser?: () => { user: any, stories: any[] } | null
 * - onRequestPrevUser?: () => { user: any, stories: any[] } | null
 */
function StoryViewerContent({
  isOpen,
  onClose,
  initialUser,
  initialStories = [],
  onRequestNextUser,
  onRequestPrevUser,
}) {
  // On gère localement l'utilisateur et ses stories pour pouvoir "enchaîner" vers le suivant/précédent
  const [user, setUser] = useState(initialUser || null);
  const [stories, setStories] = useState(
    Array.isArray(initialStories) ? initialStories : []
  );
  const [index, setIndex] = useState(0);

  const [liked, setLiked] = useState(false);
  const [query, setQuery] = useState("");

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const [imageProgress, setImageProgress] = useState(0);

  const username = user?.login?.username ?? "Story";
  const current = stories[index];

  // Reset à l'ouverture & synchronisation avec initial*
  useEffect(() => {
    if (!isOpen) return;
    setUser(initialUser || null);
    setStories(Array.isArray(initialStories) ? initialStories : []);
    setIndex(0);
    setImageProgress(0);
    setLiked(false);
    setQuery("");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, initialUser, initialStories]);

  // Navigation
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const closeAndCleanup = () => {
    clearTimer();
    onClose();
  };

  const jumpToNextUser = () => {
    if (typeof onRequestNextUser === "function") {
      const res = onRequestNextUser();
      if (res && res.user && Array.isArray(res.stories) && res.stories.length) {
        setUser(res.user);
        setStories(res.stories);
        setIndex(0);
        setImageProgress(0);
        setLiked(false);
        return true;
      }
    }
    return false;
  };

  const jumpToPrevUser = () => {
    if (typeof onRequestPrevUser === "function") {
      const res = onRequestPrevUser();
      if (res && res.user && Array.isArray(res.stories) && res.stories.length) {
        setUser(res.user);
        setStories(res.stories);
        setIndex(0);
        setImageProgress(0);
        setLiked(false);
        return true;
      }
    }
    return false;
  };

  const next = () => {
    clearTimer();
    if (index < stories.length - 1) {
      setIndex((i) => i + 1);
      setImageProgress(0);
      setLiked(false);
    } else {
      // dernière story -> tenter user suivant
      const jumped = jumpToNextUser();
      if (!jumped) closeAndCleanup();
    }
  };

  const prev = () => {
    clearTimer();
    if (index > 0) {
      setIndex((i) => i - 1);
      setImageProgress(0);
      setLiked(false);
    } else {
      // première story -> tenter user précédent
      const jumped = jumpToPrevUser();
      if (!jumped) closeAndCleanup();
    }
  };

  // Auto-advance images
  useEffect(() => {
    clearTimer();
    if (!isOpen || !current) return;

    if (current.type === "image") {
      const durationMs = current.duration ?? 5000;
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const p = Math.min(1, elapsed / durationMs);
        setImageProgress(p);
        if (p >= 1) next();
      }, 50);
      return () => clearTimer();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, current, stories]);

  const onVideoTimeUpdate = () => {
    // tick pour barre de progression vidéo
    setImageProgress((v) => (v === 0 ? 0.000001 : 0));
  };

  const onImgError = () => {
    console.warn("[StoryViewer] image error, skipping", current?.url);
    next();
  };

  const onVideoError = () => {
    console.warn("[StoryViewer] video error, skipping", current?.url);
    next();
  };

  const progressSegments = useMemo(
    () =>
      stories.map((_, i) => {
        if (i < index) return 100;
        if (i > index) return 0;
        if (current?.type === "video") {
          const vid = videoRef.current;
          if (vid && vid.duration > 0) {
            return Math.min(100, (vid.currentTime / vid.duration) * 100);
          }
          return 0;
        }
        return Math.min(100, imageProgress * 100);
      }),
    [stories, index, current?.type, imageProgress]
  );

  if (!isOpen) return null;

  if (!stories.length || !current) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">Aucune story à afficher.</p>
          <button
            onClick={closeAndCleanup}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
      aria-modal="true"
      role="dialog"
    >
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 right-0 pt-4 px-3 sm:px-6 z-20">
        <div className="flex gap-1">
          {progressSegments.map((value, i) => (
            <div
              key={i}
              className="h-1 bg-white/30 rounded w-full overflow-hidden"
            >
              <div
                className="h-full bg-white rounded transition-all duration-100"
                style={{ width: `${value}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-6 left-3 sm:left-6 text-white font-semibold z-20">
        {username}
      </div>
      <button
        onClick={closeAndCleanup}
        className="absolute top-4 right-3 sm:right-6 p-2 bg-white/10 rounded-full text-white z-20"
      >
        <FiX className="text-2xl" />
      </button>

      {/* MEDIA plein écran (cover) */}
      <div className="flex-1 relative">
        {current.type === "image" ? (
          <img
            src={current.url}
            alt={`Story de ${username}`}
            className="w-full h-full object-cover"
            onError={onImgError}
          />
        ) : (
          <video
            ref={videoRef}
            src={current.url}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
            onEnded={next}
            onError={onVideoError}
            onTimeUpdate={onVideoTimeUpdate}
            onLoadedMetadata={onVideoTimeUpdate}
            controls={false}
          />
        )}

        {/* Zones cliquables */}
        <button
          aria-label="Story précédente"
          onClick={prev}
          className="absolute left-0 top-0 h-full w-1/4 bg-transparent"
        />
        <button
          aria-label="Story suivante"
          onClick={next}
          className="absolute right-0 top-0 h-full w-1/4 bg-transparent"
        />

        {/* Flèches (desktop) */}
        <div className="hidden md:flex items-center justify-between absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto m-3">
            <button
              onClick={prev}
              className="p-2 bg-white/10 rounded-full text-white"
              aria-label="Précédent"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
          </div>
          <div className="pointer-events-auto m-3">
            <button
              onClick={next}
              className="p-2 bg-white/10 rounded-full text-white"
              aria-label="Suivant"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* BARRE DU BAS */}
      <div className="w-full p-3 sm:p-4 bg-black/80 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white/10 rounded-full px-3 py-2">
          <FiSearch className="text-white/80" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="bg-transparent outline-none text-white placeholder-white/60 w-full"
          />
        </div>
        <button
          onClick={() => setLiked((v) => !v)}
          className={`p-2 rounded-full ${
            liked ? "bg-pink-600 text-white" : "bg-white/10 text-white"
          }`}
          aria-label="Like"
        >
          <FiHeart className="text-xl" />
        </button>
        <button
          onClick={() =>
            console.log("[StoryViewer] send", current?.url, "query:", query)
          }
          className="p-2 rounded-full bg-white/10 text-white"
          aria-label="Envoyer"
        >
          <FiSend className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default function StoryViewer(props) {
  if (typeof window === "undefined") return null;
  return createPortal(<StoryViewerContent {...props} />, document.body);
}
