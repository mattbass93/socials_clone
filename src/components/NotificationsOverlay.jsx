import { useEffect, useState, useRef } from "react";
import axios from "axios";

const TRANSITION_MS = 300;

function NotificationsOverlay({ visible, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [shouldRender, setShouldRender] = useState(false);
  const [entered, setEntered] = useState(false);

  const overlayRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);

  // Id d'ouverture pour ignorer les résultats obsolètes
  const openIdRef = useRef(0);

  const nextFrame = (cb) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (overlayRef.current) overlayRef.current.getBoundingClientRect();
      rafRef.current = requestAnimationFrame(() => cb?.());
    });
  };

  // Charger des données quand visible (anti-double-fetch)
  useEffect(() => {
    if (!visible) return;
    const myOpenId = ++openIdRef.current;

    const controller = new AbortController();
    axios
      .get("https://randomuser.me/api/?results=6", {
        signal: controller.signal,
      })
      .then((res) => {
        if (openIdRef.current !== myOpenId) return; // ignorer résultats obsolètes
        const rawUsers = res.data.results;
        const sampleNotifications = [
          {
            section: "Aujourd'hui",
            items: [
              {
                user: rawUsers[0],
                type: "mention",
                time: "8h",
                postImg: "https://source.unsplash.com/random/50x50?1",
              },
              {
                user: rawUsers[1],
                type: "mention",
                time: "6h",
                postImg: "https://source.unsplash.com/random/50x50?2",
              },
            ],
          },
          {
            section: "Ce mois-ci",
            items: [
              {
                user: rawUsers[2],
                type: "mention",
                time: "12j",
                postImg: "https://source.unsplash.com/random/50x50?3",
              },
              {
                user: rawUsers[3],
                type: "mention",
                time: "27j",
                postImg: "https://source.unsplash.com/random/50x50?4",
              },
            ],
          },
          {
            section: "Plus tôt",
            items: [
              {
                user: rawUsers[4],
                type: "follow",
                time: "1mois",
              },
              {
                user: rawUsers[5],
                type: "mention",
                time: "2mois",
                postImg: "https://source.unsplash.com/random/50x50?5",
              },
            ],
          },
        ];
        setNotifications(sampleNotifications);
      })
      .catch((err) => {
        if (axios.isCancel?.(err)) return;
        if (err.name === "CanceledError") return;
        console.error(err);
      });

    return () => controller.abort();
  }, [visible]);

  // Fermer si clic en dehors (uniquement quand monté)
  useEffect(() => {
    if (!shouldRender) return;
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shouldRender, onClose]);

  // Animation entrée/sortie
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      setShouldRender(true);
      setEntered(false);
      nextFrame(() => setEntered(true));
      timerRef.current = setTimeout(() => {}, TRANSITION_MS);
    } else if (shouldRender) {
      setEntered(false);
      timerRef.current = setTimeout(
        () => setShouldRender(false),
        TRANSITION_MS
      );
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className={[
        "fixed top-0 md:left-18 bottom-0 w-100 bg-black border-r border-gray-700 text-white",
        "px-6 pt-8 overflow-y-auto",
        "transform will-change-transform origin-left",
        "transition-transform duration-300 ease-out",
        "z-[60]",
        entered ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
      aria-label="Panneau de notifications"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Notifications</h2>
        <span className="text-blue-400 text-sm cursor-pointer hover:underline">
          Filtrer
        </span>
      </div>

      {notifications.map((section, sIndex) => (
        <div key={sIndex} className="mb-6">
          <h3 className="text-sm text-gray-400 mb-4">{section.section}</h3>
          <div className="space-y-4">
            {section.items.map((notif, i) => (
              <div
                key={i}
                className="flex items-center justify-between hover:bg-[#262626] rounded-lg p-2"
              >
                {/* Left : avatar + texte */}
                <div className="flex items-center space-x-3">
                  <img
                    src={notif.user.picture.thumbnail}
                    alt={notif.user.login.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="text-sm leading-tight">
                    <span className="font-semibold mr-1">
                      {notif.user.login.username}
                    </span>
                    {notif.type === "follow" ? (
                      <>a commencé à vous suivre.</>
                    ) : (
                      <>vous a identifié dans une publication.</>
                    )}
                    <span className="ml-1 text-gray-500">{notif.time}</span>
                  </p>
                </div>

                {/* Right : soit image post soit bouton */}
                {notif.type === "follow" ? (
                  <button className="bg-white text-black text-sm font-semibold px-3 py-1 rounded">
                    Suivre en retour
                  </button>
                ) : (
                  <img
                    src={notif.postImg}
                    alt="post"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationsOverlay;
