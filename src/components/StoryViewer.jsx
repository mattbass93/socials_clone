import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiSend,
  FiSearch,
  FiPlay,
  FiPause,
} from "react-icons/fi";

/**
 * Props :
 * - isOpen: boolean
 * - onClose: () => void
 * - initialUser: { id?: string|number, login?: { username?: string, avatarUrl?: string } } | null
 * - initialStories: Array<{ type: "image" | "video", url: string, duration?: number }>
 * - onRequestNextUser?: () => { user: any, stories: any[] } | null
 * - onRequestPrevUser?: () => { user: any, stories: any[] } | null
 */

const SIDE_PREVIEW_COUNT = 2; // 2 cartes (chacune = 1 utilisateur + son groupe de stories) à gauche et à droite
const MAX_FETCH_ATTEMPTS = 8; // sécurité pour tenter d’obtenir des utilisateurs uniques

function StoryViewerContent({
  isOpen,
  onClose,
  initialUser,
  initialStories = [],
  onRequestNextUser,
  onRequestPrevUser,
}) {
  // --- État principal ---
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
  const [isPlaying, setIsPlaying] = useState(true);

  const username = user?.login?.username ?? "Story";
  const avatarUrl = user?.login?.avatarUrl;
  const current = stories[index];

  // --- Piles voisines : chaque entrée = UN utilisateur + son groupe de stories ---
  const [prevStack, setPrevStack] = useState([]); // [{ user, stories }, ...] (utilisateurs précédents)
  const [nextStack, setNextStack] = useState([]); // [{ user, stories }, ...] (utilisateurs suivants)

  // Helpers d’unicité
  const getUserKey = (u) =>
    u?.id ?? u?.login?.username ?? JSON.stringify(u ?? {});

  // Reset à l’ouverture + synchro
  useEffect(() => {
    if (!isOpen) return;
    setUser(initialUser || null);
    setStories(Array.isArray(initialStories) ? initialStories : []);
    setIndex(0);
    setImageProgress(0);
    setLiked(false);
    setQuery("");
    setPrevStack([]);
    setNextStack([]);
    setIsPlaying(true);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, initialUser, initialStories]);

  // Remplir les piles (UN utilisateur par carte latérale) avec DÉDOUBLONNAGE
  const refillStacks = () => {
    // on collecte des utilisateurs uniques pour chaque côté
    const collectUnique = (cb, count) => {
      const out = [];
      const seen = new Set();
      if (typeof cb !== "function") return out;

      for (
        let attempts = 0;
        attempts < MAX_FETCH_ATTEMPTS && out.length < count;
        attempts++
      ) {
        const r = cb();
        if (!(r && r.user && Array.isArray(r.stories) && r.stories.length))
          break;

        const k = getUserKey(r.user);
        // on évite : 1) doublons, 2) l’utilisateur courant
        if (!seen.has(k) && k !== getUserKey(user)) {
          seen.add(k);
          out.push(r);
        }
      }
      return out;
    };

    const prevs = collectUnique(onRequestPrevUser, SIDE_PREVIEW_COUNT);
    const nexts = collectUnique(onRequestNextUser, SIDE_PREVIEW_COUNT);

    setPrevStack(prevs);
    setNextStack(nexts);
  };

  // Quand l’utilisateur courant change, on met à jour les aperçus desktop
  useEffect(() => {
    if (!isOpen || !user) return;
    refillStacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen]);

  // --- Navigation ---
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

  const jumpToUser = (payload) => {
    setUser(payload.user);
    setStories(payload.stories);
    setIndex(0);
    setImageProgress(0);
    setLiked(false);
    setIsPlaying(true);
  };

  const jumpToNextUser = () => {
    if (nextStack.length) {
      const first = nextStack[0];
      jumpToUser(first);
      return true;
    }
    if (typeof onRequestNextUser === "function") {
      const res = onRequestNextUser();
      if (res && res.user && Array.isArray(res.stories) && res.stories.length) {
        jumpToUser(res);
        return true;
      }
    }
    return false;
  };

  const jumpToPrevUser = () => {
    if (prevStack.length) {
      const first = prevStack[0];
      jumpToUser(first);
      return true;
    }
    if (typeof onRequestPrevUser === "function") {
      const res = onRequestPrevUser();
      if (res && res.user && Array.isArray(res.stories) && res.stories.length) {
        jumpToUser(res);
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
      setIsPlaying(true);
    } else {
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
      setIsPlaying(true);
    } else {
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

  // cohérence lecture/pause vidéo
  useEffect(() => {
    if (current?.type === "video") setIsPlaying(true);
  }, [current?.type, index]);

  const onVideoTimeUpdate = () => {
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

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
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
        </div>
      </div>
    );
  }

  // --- Components Desktop (aperçus latéraux) ---
  const firstMediaUrl = (arr) => (Array.isArray(arr) && arr[0]?.url) || null;

  const StoryPreviewCard = ({ data, onClick }) => {
    const cover = firstMediaUrl(data?.stories);
    const uname = data?.user?.login?.username || "Story";
    const isVideo =
      typeof cover === "string" &&
      (cover.endsWith(".mp4") || cover.toLowerCase().includes(".mp4"));
    return (
      <button
        onClick={onClick}
        className="w-[200px] aspect-[9/16] rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 hover:bg-white/10 focus:outline-none"
        title={uname}
        aria-label={`Ouvrir la story de ${uname}`}
      >
        <div className="relative w-full h-full">
          {cover ? (
            isVideo ? (
              <video
                src={cover}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
                loop
              />
            ) : (
              <img
                src={cover}
                alt={uname}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full bg-white/10" />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <span className="text-white text-xs font-medium truncate block">
              {uname}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black"
      aria-modal="true"
      role="dialog"
    >
      {/* Bouton fermer */}
      <button
        onClick={closeAndCleanup}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/15 rounded-full text-white z-30"
        aria-label="Fermer"
      >
        <FiX className="text-2xl" />
      </button>

      {/* =======================
          MOBILE — rendu original
          ======================= */}
      <div className="lg:hidden fixed inset-0 flex flex-col">
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

        {/* MEDIA plein écran */}
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

          {/* Bouton Play/Pause (mobile) */}
          {current.type === "video" && (
            <button
              onClick={togglePlay}
              className="absolute bottom-24 right-4 p-2 rounded-full bg-black/50 text-white"
              aria-label={isPlaying ? "Mettre en pause" : "Lecture"}
            >
              {isPlaying ? (
                <FiPause className="text-2xl" />
              ) : (
                <FiPlay className="text-2xl" />
              )}
            </button>
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

          {/* Flèches */}
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

        {/* Barre du bas */}
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

      {/* =======================
          DESKTOP — 2 | BIG | 2 (UNE carte = UN utilisateur UNIQUE)
          ======================= */}
      <div className="hidden lg:flex h-full w-full items-center justify-center">
        <div className="flex items-center gap-6">
          {/* 2 cartes = 2 utilisateurs précédents (noms uniques) */}
          {prevStack.slice(0, SIDE_PREVIEW_COUNT).map((data, i) => (
            <StoryPreviewCard
              key={`prev-${getUserKey(data.user)}-${i}`}
              data={data}
              onClick={() => {
                setUser(data.user);
                setStories(data.stories);
                setIndex(0);
                setImageProgress(0);
                setLiked(false);
                setIsPlaying(true);
              }}
            />
          ))}

          {/* Grande card centrale — réduite en hauteur pour toujours voir la barre de progression */}
          <div
            className="relative rounded-xl overflow-hidden bg-black ring-1 ring-white/10 aspect-[9/16] w-auto"
            style={{ height: "82vh", maxHeight: "860px" }}
          >
            {/* Barre de progression */}
            <div className="absolute top-0 left-0 right-0 pt-4 px-4 z-20">
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

            {/* Nom + avatar (utilisateur central) */}
            <div className="absolute top-6 left-4 text-white font-semibold z-20 flex items-center gap-2">
              <div className="relative">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 via-red-500 to-amber-400">
                  <div className="rounded-full bg-black p-[2px]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 grid place-items-center text-white/80 text-sm">
                        {username?.slice(0, 1).toUpperCase() || "•"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="max-w-[240px] truncate">{username}</span>
            </div>

            {/* Media */}
            <div className="absolute inset-0">
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
            </div>

            {/* Bouton Lecture/Pause */}
            {current.type === "video" && (
              <button
                onClick={togglePlay}
                className="absolute bottom-24 right-4 p-3 rounded-full bg-black/50 text-white"
                aria-label={isPlaying ? "Mettre en pause" : "Lecture"}
              >
                {isPlaying ? (
                  <FiPause className="text-2xl" />
                ) : (
                  <FiPlay className="text-2xl" />
                )}
              </button>
            )}

            {/* Zones cliquables */}
            <button
              aria-label="Story précédente"
              onClick={prev}
              className="absolute left-0 top-0 h-full w-1/3 bg-transparent"
            />
            <button
              aria-label="Story suivante"
              onClick={next}
              className="absolute right-0 top-0 h-full w-1/3 bg-transparent"
            />

            {/* Flèches */}
            <div className="hidden lg:flex items-center justify-between absolute inset-0 pointer-events-none">
              <div className="pointer-events-auto m-3">
                <button
                  onClick={prev}
                  className="p-2 bg-black/40 hover:bg-black/50 rounded-full text-white"
                  aria-label="Précédent"
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
              </div>
              <div className="pointer-events-auto m-3">
                <button
                  onClick={next}
                  className="p-2 bg-black/40 hover:bg-black/50 rounded-full text-white"
                  aria-label="Suivant"
                >
                  <FiChevronRight className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Barre du bas */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="w-full p-4 bg-black/60 backdrop-blur-[2px] flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 bg-white/10 rounded-full px-3 py-2">
                  <FiSearch className="text-white/80" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Envoyer un message…"
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
                    console.log(
                      "[StoryViewer] send",
                      current?.url,
                      "query:",
                      query
                    )
                  }
                  className="p-2 rounded-full bg-white/10 text-white"
                  aria-label="Envoyer"
                >
                  <FiSend className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* 2 cartes = 2 utilisateurs suivants (noms uniques) */}
          {nextStack.slice(0, SIDE_PREVIEW_COUNT).map((data, i) => (
            <StoryPreviewCard
              key={`next-${getUserKey(data.user)}-${i}`}
              data={data}
              onClick={() => {
                setUser(data.user);
                setStories(data.stories);
                setIndex(0);
                setImageProgress(0);
                setLiked(false);
                setIsPlaying(true);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StoryViewer(props) {
  if (typeof window === "undefined") return null;
  return createPortal(<StoryViewerContent {...props} />, document.body);
}
