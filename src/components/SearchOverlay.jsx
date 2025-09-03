import { useState, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const TRANSITION_MS = 300;

/**
 * Cache mémoire (module-scope) pour conserver les utilisateurs
 * tant que la page n’est pas rechargée. Au reload, ce module
 * est réévalué et le cache est naturellement vidé.
 */
let __SEARCH_CACHE_USERS__ = null;

function SearchOverlay({ visible, onClose }) {
  const [users, setUsers] = useState([]);
  const [shouldRender, setShouldRender] = useState(false); // reste monté pendant la sortie
  const [entered, setEntered] = useState(false); // true => translate-x-0 (en place)

  const panelRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  // Id d'ouverture pour ignorer les résultats obsolètes (StrictMode / effets doublés)
  const openIdRef = useRef(0);

  // Garantit que la position initiale est peinte avant de lancer l'anim
  const nextFrame = (cb) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.getBoundingClientRect(); // force reflow
      rafRef.current = requestAnimationFrame(() => cb?.());
    });
  };

  /**
   * Charger des users quand l’overlay devient visible.
   * - Si on a déjà des users en state, ne rien faire (réouverture = mêmes users).
   * - Sinon, si un cache mémoire existe, l'utiliser.
   * - Sinon, fetch et peupler le cache + state.
   */
  useEffect(() => {
    if (!visible) return;

    if (users.length > 0) return;

    if (
      Array.isArray(__SEARCH_CACHE_USERS__) &&
      __SEARCH_CACHE_USERS__.length > 0
    ) {
      setUsers(__SEARCH_CACHE_USERS__);
      return;
    }

    const myOpenId = ++openIdRef.current;
    const controller = new AbortController();

    axios
      .get("https://randomuser.me/api/?results=5", {
        signal: controller.signal,
      })
      .then((res) => {
        if (openIdRef.current === myOpenId) {
          const fetched = res.data?.results ?? [];
          setUsers(fetched);
          __SEARCH_CACHE_USERS__ = fetched; // peupler le cache mémoire
        }
      })
      .catch((err) => {
        // Annulations / abort ignorés
        if (axios.isCancel?.(err)) return;
        if (err?.name === "CanceledError") return;
        console.error(err);
      });

    return () => controller.abort();
  }, [visible, users.length]);

  // Fermer si clic en dehors du panneau (seulement quand monté)
  useEffect(() => {
    if (!shouldRender) return;
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shouldRender, onClose]);

  // Orchestration entrée/sortie — double rAF + reflow pour fiabiliser l'ouverture
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      setShouldRender(true);
      setEntered(false); // hors écran
      nextFrame(() => setEntered(true)); // -> translate-x-0 (anim d'entrée)
      timerRef.current = setTimeout(() => {}, TRANSITION_MS);
    } else if (shouldRender) {
      setEntered(false); // -> -translate-x-full (anim de sortie)
      timerRef.current = setTimeout(() => {
        setShouldRender(false); // démonter après la transition
      }, TRANSITION_MS);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, shouldRender]);

  if (!shouldRender) return null;

  // Effacer à la demande: vide le state + invalide le cache
  const handleClearAll = () => {
    setUsers([]);
    __SEARCH_CACHE_USERS__ = null;
  };

  // Supprimer un user: met à jour state + cache
  const handleRemoveAt = (index) => {
    setUsers((prev) => {
      const next = prev.filter((_, i) => i !== index);
      __SEARCH_CACHE_USERS__ = next.length ? next : null;
      return next;
    });
  };

  return (
    <div
      ref={panelRef}
      className={[
        "fixed md:left-18 top-0 bottom-0 w-[350px] bg-black",
        "border-r border-gray-700 flex flex-col items-center overflow-y-auto",
        // ANIM
        "transform will-change-transform origin-left",
        "transition-transform duration-300 ease-out",
        "z-[60]",
        entered ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      aria-label="Panneau de recherche"
    >
      <h2 className="w-11/12 text-white text-2xl mb-6 mt-5">Recherche</h2>

      {/* Barre de recherche */}
      <div className="w-11/12 max-w-md mb-8">
        <input
          type="text"
          placeholder="Rechercher"
          className="w-full px-4 py-2 rounded-md bg-[rgb(38,38,38)] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Section Récent */}
      <div className="w-11/12 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg">Récent</h3>
          <button
            onClick={handleClearAll}
            className="text-blue-500 hover:underline"
          >
            Tout effacer
          </button>
        </div>

        <div className="space-y-2">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between pb-1 hover:bg-[rgb(38,38,38)] cursor-pointer rounded-md px-2"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.picture.thumbnail}
                  alt={user.login.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-white font-semibold">
                    {user.login.username}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {user.location.city}, {user.location.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveAt(index)}
                className="text-gray-400 text-xl"
                aria-label="Supprimer"
                title="Supprimer"
              >
                <FaTimes />
              </button>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun compte récent.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
