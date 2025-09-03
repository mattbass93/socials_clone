import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Story from "./Story";
import StoryViewer from "./StoryViewer";

/**
 * Props:
 * - users: Array<User>
 * - mediaPool: (string | {url?:string, src?:string, image?:string, video?:string})[]
 *
 * Comportement:
 * - "Votre story" est affichée en premier, SANS story (non cliquable).
 * - Tous les autres users ouvrent une story générée aléatoirement.
 * - La navigation prev/next dans le viewer IGNORE "Votre story".
 *
 * Desktop:
 * - On remplace la pagination par un scroll horizontal fluide (scroll-snap + smooth)
 * - Les flèches déclenchent un scrollBy sur la largeur visible, comme un swipe Instagram.
 * - La barre de scroll horizontale est masquée en desktop.
 */
function StoriesCarousel({ users, mediaPool = [] }) {
  // ---- Normalisation du mediaPool en URLs string http(s)
  const normalizeMediaPool = (poolLike) => {
    const toUrls = (m) => {
      if (!m) return [];
      if (typeof m === "string") return [m];
      if (Array.isArray(m)) return m.flatMap(toUrls);
      if (typeof m === "object") {
        return [m.url, m.src, m.image, m.video].filter(Boolean);
      }
      return [];
    };
    const flat = toUrls(poolLike);
    return flat
      .filter((u) => typeof u === "string" && /^https?:\/\//i.test(u))
      .filter(Boolean);
  };
  const normalizedPool = useMemo(
    () => normalizeMediaPool(mediaPool),
    [mediaPool]
  );

  // ---- Construction de la liste d'affichage avec "Votre story" en tête
  const extendedUsers = useMemo(() => {
    const self = {
      isSelf: true,
      login: { username: "Votre story" },
      picture: { thumbnail: undefined },
    };
    return [self, ...(users ?? [])];
  }, [users]);

  // ---- Liste des VRAIS utilisateurs qui ont des stories (exclut "Votre story")
  const playableUsers = useMemo(
    () => extendedUsers.filter((u) => !u.isSelf),
    [extendedUsers]
  );

  // --------- Génération aléatoire de stories ---------
  const sample = (arr, k) => {
    const copy = [...arr];
    const out = [];
    for (let i = 0; i < k && copy.length; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(idx, 1)[0]);
    }
    return out;
  };

  const isVideo = (url) => {
    if (!url || typeof url !== "string") return false;
    const u = url.split("?")[0].toLowerCase();
    return [".mp4", ".webm", ".ogg", ".mov", ".m4v"].some((ext) =>
      u.endsWith(ext)
    );
  };

  const buildRandomStories = (countMin = 3, countMax = 5) => {
    const count =
      countMin +
      Math.floor(Math.random() * Math.max(1, countMax - countMin + 1));
    const pool =
      normalizedPool && normalizedPool.length ? normalizedPool : null;
    const picks = pool ? sample(pool, Math.min(count, pool.length)) : [];
    const fromPool = picks.map((url) => ({
      type: isVideo(url) ? "video" : "image",
      url,
      duration: isVideo(url)
        ? undefined
        : 4000 + Math.floor(Math.random() * 2500),
    }));
    if (fromPool.length) return fromPool;

    // Fallback si aucun média valide
    return Array.from({ length: count }).map((_, i) => ({
      type: "image",
      url: `https://picsum.photos/seed/story-${Date.now()}-${i}/900/1600`,
      duration: 4500,
    }));
  };

  // --- État du viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUserIndex, setViewerUserIndex] = useState(0); // index dans playableUsers
  const [viewerInitialUser, setViewerInitialUser] = useState(null);
  const [viewerInitialStories, setViewerInitialStories] = useState([]);

  // Ouvre le viewer uniquement pour un user "jouable" (pas self)
  const openViewer = (user) => {
    if (user?.isSelf) return;
    const idx = playableUsers.findIndex(
      (u) => u === user || u?.login?.username === user?.login?.username
    );
    if (idx === -1) return;

    const stories = buildRandomStories();
    setViewerUserIndex(idx);
    setViewerInitialUser(user);
    setViewerInitialStories(stories);
    setViewerOpen(true);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerInitialUser(null);
    setViewerInitialStories([]);
  };

  const requestNextUser = () => {
    const nextIndex = viewerUserIndex + 1;
    if (nextIndex < playableUsers.length) {
      const user = playableUsers[nextIndex];
      const stories = buildRandomStories();
      setViewerUserIndex(nextIndex);
      return { user, stories };
    }
    return null;
  };

  const requestPrevUser = () => {
    const prevIndex = viewerUserIndex - 1;
    if (prevIndex >= 0) {
      const user = playableUsers[prevIndex];
      const stories = buildRandomStories();
      setViewerUserIndex(prevIndex);
      return { user, stories };
    }
    return null;
  };

  // --- Références & logique de scroll desktop
  const desktopScrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollStates = () => {
    const el = desktopScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollStates();
    const el = desktopScrollRef.current;
    if (!el) return;
    const handler = () => updateScrollStates();
    el.addEventListener("scroll", handler, { passive: true });
    const ro = new ResizeObserver(handler);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", handler);
      ro.disconnect();
    };
  }, []);

  const handlePrev = () => {
    const el = desktopScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
  };
  const handleNext = () => {
    const el = desktopScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
  };

  // --- Mobile (scroll horizontal libre + snap)
  const mobileStories = (
    <div className="flex w-screen items-center sm:hidden">
      <div className="flex overflow-x-auto no-scrollbar pt-2 space-x-1 scroll-smooth snap-x snap-mandatory px-1">
        {extendedUsers.map((user, index) => (
          <div
            key={`${user.login?.username ?? "self"}-${index}`}
            className="flex-shrink-0 snap-start"
          >
            <Story
              username={user.login.username}
              avatar={user.isSelf ? undefined : user.picture?.thumbnail}
              isSelf={user.isSelf}
              onClick={() => !user.isSelf && openViewer(user)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  // --- Desktop (défilement fluide façon Instagram) + scrollbar masquée
  const desktopStories = (
    <div className="relative max-w-xl pt-4 md:border-t md:border-gray-700 hidden sm:block">
      <div
        ref={desktopScrollRef}
        className="
          relative w-full overflow-x-auto scroll-smooth snap-x snap-mandatory
          md:[scrollbar-width:none] md:[-ms-overflow-style:none]
          md:[&::-webkit-scrollbar]:hidden
        "
      >
        <div className="flex space-x-3 ">
          {extendedUsers.map((user, idx) => (
            <div
              key={`${user.login?.username ?? "self"}-${idx}`}
              className="flex-shrink-0 snap-start"
            >
              <Story
                username={user.login.username}
                avatar={user.isSelf ? undefined : user.picture?.thumbnail}
                isSelf={user.isSelf}
                onClick={() => !user.isSelf && openViewer(user)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flèches */}
      <button
        onClick={handlePrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 disabled:opacity-30 p-1 bg-white bg-opacity-90 rounded-full shadow"
        aria-label="Précédent"
      >
        <FiChevronLeft className="text-lg text-black" />
      </button>

      <button
        onClick={handleNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 disabled:opacity-30 p-1 bg-white bg-opacity-90 rounded-full shadow"
        aria-label="Suivant"
      >
        <FiChevronRight className="text-lg text-black" />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      {mobileStories}
      {desktopStories}

      {/* Modale */}
      <StoryViewer
        isOpen={viewerOpen}
        onClose={closeViewer}
        initialUser={viewerInitialUser}
        initialStories={viewerInitialStories}
        onRequestNextUser={requestNextUser}
        onRequestPrevUser={requestPrevUser}
      />
    </div>
  );
}

export default StoriesCarousel;
