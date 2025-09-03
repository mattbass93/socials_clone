import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";

const TRANSITION_MS = 300;

function MessagesOverlay({ visible = true, onClose }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const panelRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  // Contrôle de rendu + état visuel
  const [shouldRender, setShouldRender] = useState(false); // reste monté pendant la sortie
  const [entered, setEntered] = useState(false); // true => translate-x-0

  // utilité : garantit que la position initiale est peinte avant de lancer l'anim
  const nextFrame = (cb) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (panelRef.current) panelRef.current.getBoundingClientRect(); // force reflow
      rafRef.current = requestAnimationFrame(() => cb?.());
    });
  };

  // Charger les données quand l’overlay devient visible
  useEffect(() => {
    if (!visible) return;
    axios
      .get("https://randomuser.me/api/?results=8")
      .then((res) => {
        setUsers(res.data.results);
        setCurrentUser(res.data.results[0]); // le 1er user comme profil actuel
      })
      .catch(console.error);
  }, [visible]);

  // Orchestration entrée/sortie
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      setShouldRender(true);
      setEntered(false); // hors écran
      nextFrame(() => setEntered(true)); // -> translate-x-0 (anim d'entrée)
      timerRef.current = setTimeout(() => {
        // fin anim entrée (optionnel)
      }, TRANSITION_MS);
    } else if (shouldRender) {
      setEntered(false); // -> -translate-x-full (anim de sortie)
      timerRef.current = setTimeout(() => {
        setShouldRender(false); // démonte après la transition
      }, TRANSITION_MS);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, shouldRender]);

  // (Optionnel) fermer si clic en dehors — seulement si onClose est fourni
  useEffect(() => {
    if (!shouldRender || !onClose) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      ref={panelRef}
      className={[
        "fixed md:left-18 top-0 bottom-0 w-[350px] bg-black",
        "border-r border-l border-gray-700",
        // z faible : c'est le wrapper (dans Messages.jsx) qui déterminera la pile globale
        "z-10 flex flex-col px-4 py-6 overflow-y-auto text-white",
        // Animations (identiques aux autres overlays)
        "transform will-change-transform origin-left",
        "transition-transform duration-300 ease-out",
        entered ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      aria-label="Panneau Messages"
    >
      {/* En-tête */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-bold">
          {currentUser?.login?.username || "Utilisateur"}
        </span>
        <FiEdit2 className="text-xl cursor-pointer" />
      </div>

      {/* Barre de recherche */}
      <div
        style={{ backgroundColor: "rgb(38, 38, 38)" }}
        className="flex items-center rounded px-3 py-2 mb-6"
      >
        <BiSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Rechercher"
          className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400"
        />
      </div>

      {/* Zone note */}
      {currentUser && (
        <div className=" items-center mb-6 space-x-3 cursor-pointer ml-3">
          <div className="relative flex flex-col ">
            <div className="absolute -top-2 -left-2 text-xs bg-gray-700 text-white px-2 py-1 rounded-full">
              Note...
            </div>
            <img
              src={currentUser.picture.thumbnail}
              alt="note"
              className="w-17 h-17 rounded-full"
            />
          </div>
          <span className="text-sm text-gray-300">Votre note</span>
        </div>
      )}

      {/* Onglets */}
      <div className="flex justify-between items-center mb-4 px-1">
        <p className="text-white font-bold text-m">Messages</p>
        <p className="text-gray-400 text-m cursor-pointer">Demandes</p>
      </div>

      {/* Liste des messages */}
      <div className="space-y-3">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 pt-2 pb-2 w-full hover:bg-[rgb(38,38,38)] cursor-pointer"
          >
            <img
              src={user.picture.thumbnail}
              alt={user.login.username}
              className="w-14 h-14 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium truncate max-w-[180px]">
                {user.login.username}
              </span>
              <span className="text-gray-500 text-xs">
                En ligne il y a {Math.floor(Math.random() * 60)} min
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessagesOverlay;
