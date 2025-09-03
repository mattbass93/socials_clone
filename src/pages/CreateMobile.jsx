import { useEffect, useMemo, useState } from "react";
import { FaTimes, FaCheck, FaPlay } from "react-icons/fa";
import { fetchPhotos, fetchVideos } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateMobile() {
  const [gallery, setGallery] = useState([]);
  const [selected, setSelected] = useState(null); // sélection simple
  const [multiMode, setMultiMode] = useState(false); // mode sélection multiple
  const [selectedItems, setSelectedItems] = useState([]); // sélection multiple (tableau d'items)
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = Récent, "asc" = Ancien
  const navigate = useNavigate();

  // Génère une date simulée dans les X derniers jours pour "imiter" un tri par date
  const randomDateWithin = (days = 90) => {
    const now = Date.now();
    const past = now - days * 24 * 60 * 60 * 1000;
    const ts = Math.floor(Math.random() * (now - past)) + past;
    return ts; // number (timestamp)
  };

  const sortByCreatedAt = (a, b, order = "desc") => {
    if (order === "desc") return b.createdAt - a.createdAt;
    return a.createdAt - b.createdAt;
  };

  useEffect(() => {
    async function loadMedia() {
      try {
        const [photos, videos] = await Promise.all([
          fetchPhotos(15),
          fetchVideos(5),
        ]);

        const formattedPhotos = photos.map((p, idx) => ({
          id: `img_${p.id || p.urls.full || idx}`,
          type: "image",
          url: p.urls.full,
          thumb: p.urls.small,
          createdAt: randomDateWithin(120), // ✅ date simulée
        }));

        const formattedVideos = videos.map((v, idx) => ({
          id: `vid_${v.id || idx}`,
          type: "video",
          url:
            v.video_files.find((f) => f.quality === "sd")?.link ||
            v.video_files[0]?.link,
          thumb: v.image,
          createdAt: randomDateWithin(120), // ✅ date simulée
        }));

        const medias = [...formattedPhotos, ...formattedVideos].sort((a, b) =>
          sortByCreatedAt(a, b, "desc")
        );

        setGallery(medias);
        if (medias.length > 0) setSelected(medias[0]);
        setSortOrder("desc");
      } catch (err) {
        console.error("Erreur chargement médias :", err);
      }
    }

    loadMedia();
  }, []);

  // Bascule du mode multi
  function toggleMultiMode() {
    setMultiMode((prev) => {
      const next = !prev;
      if (next) {
        setSelectedItems((curr) =>
          curr.length ? curr : selected ? [selected] : []
        );
      } else {
        setSelected((prevSel) =>
          selectedItems.length ? selectedItems[0] : prevSel
        );
        setSelectedItems([]);
      }
      return next;
    });
  }

  // Tri "Récent" / "Ancien" (simulation via createdAt)
  function toggleSort() {
    setSortOrder((prev) => {
      const next = prev === "desc" ? "asc" : "desc";
      setGallery((curr) => {
        const reordered = [...curr].sort((a, b) => sortByCreatedAt(a, b, next));
        return reordered;
      });
      return next;
    });
  }

  // Ajout/retrait dans la sélection multiple
  function toggleItem(item) {
    if (!multiMode) {
      setSelected(item);
      return;
    }
    setSelectedItems((prev) => {
      const exists = prev.find((x) => x.id === item.id);
      if (exists) {
        return prev.filter((x) => x.id !== item.id);
      }
      return [...prev, item];
    });
  }

  function clearSelection() {
    setSelectedItems([]);
  }

  const selectedCount = selectedItems.length;

  const previewContent = useMemo(() => {
    if (multiMode) {
      if (selectedCount === 0) {
        return (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Sélectionne plusieurs médias dans la galerie
          </div>
        );
      }

      const toShow = selectedItems.slice(0, 4);
      const extra = selectedItems.length - toShow.length;

      return (
        <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[2px] bg-black">
          {toShow.map((it, i) => (
            <div key={it.id} className="relative">
              <img
                src={it.type === "image" ? it.url : it.thumb}
                alt=""
                className="w-full h-full object-cover"
              />
              {it.type === "video" && (
                <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded bg-black/70 flex items-center gap-1">
                  <FaPlay className="text-[10px]" /> VIDÉO
                </span>
              )}
              {i === 3 && extra > 0 && (
                <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-2xl font-bold">
                  +{extra}
                </span>
              )}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 4 - toShow.length) }).map(
            (_, idx) => (
              <div key={`empty_${idx}`} className="bg-neutral-900" />
            )
          )}
        </div>
      );
    }

    if (!selected) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Choisis une photo ou vidéo
        </div>
      );
    }

    if (selected.type === "image") {
      return (
        <img
          src={selected.url}
          alt="preview"
          className="w-full h-full object-cover bg-black"
        />
      );
    }

    return (
      <video
        src={selected.url}
        controls
        className="w-full h-full object-cover bg-black"
      />
    );
  }, [multiMode, selected, selectedItems, selectedCount]);

  function getOrderBadge(itemId) {
    const idx = selectedItems.findIndex((x) => x.id === itemId);
    return idx >= 0 ? idx + 1 : null;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col overflow-hidden">
      {/* Topbar */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-800 bg-black shrink-0">
        <button onClick={() => navigate(-1)} aria-label="Fermer">
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-md font-semibold">Nouvelle publication</h2>
        <button
          className={`font-semibold text-sm ${
            (multiMode ? selectedCount > 0 : !!selected)
              ? "text-blue-500"
              : "text-gray-500"
          }`}
          disabled={multiMode ? selectedCount === 0 : !selected}
        >
          Suivant
        </button>
      </div>

      <div className="flex-1 min-h-0 md:flex md:flex-row md:overflow-hidden">
        {/* Preview */}
        <div className="relative flex-1 h-[549px] md:h-[auto] bg-black">
          {previewContent}

          {/* Barre d'infos en bas de la preview en mode multi */}
          {multiMode && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 border border-neutral-700 px-3 py-1.5 rounded-full text-sm">
              <span>
                {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
              </span>
              {selectedCount > 0 && (
                <button
                  onClick={clearSelection}
                  className="text-xs border border-neutral-600 px-2 py-0.5 rounded-md"
                >
                  Tout désélectionner
                </button>
              )}
            </div>
          )}
        </div>

        {/* Galerie */}
        <div
          className={`bg-black border-t border-neutral-800 max-h-[35vh] overflow-y-auto shrink-0
                        md:max-h-none md:h-auto md:w-[360px] md:border-t-0 md:border-l md:border-neutral-800 md:overflow-y-auto`}
        >
          {/* Barre outils galerie */}
          <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/70 z-10">
            <button
              onClick={toggleSort}
              className="text-sm"
              title="Basculer l'ordre de tri (simulation par date)"
            >
              {sortOrder === "desc" ? "Récent ▾" : "Ancien ▴"}
            </button>

            <button
              onClick={toggleMultiMode}
              className={`text-xs border px-2 py-1 rounded-md ${
                multiMode
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-600 text-white"
              }`}
            >
              {multiMode ? "SÉLECTION MULTIPLE ACTIVÉE" : "SÉLECTION MULTIPLE"}
            </button>
          </div>

          {/* Grille des vignettes */}
          <div className="grid grid-cols-3 gap-[1px]">
            {gallery.map((item, i) => {
              const isActive = multiMode
                ? selectedItems.some((x) => x.id === item.id)
                : selected?.id === item.id || selected?.url === item.url;

              const order = multiMode ? getOrderBadge(item.id) : null;

              return (
                <button
                  key={item.id || i}
                  type="button"
                  className="relative aspect-square"
                  onClick={() => toggleItem(item)}
                  aria-label={`Sélectionner média ${i + 1}`}
                >
                  <img
                    src={item.thumb}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Badge vidéo */}
                  {item.type === "video" && (
                    <span className="absolute bottom-1 left-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/70 flex items-center gap-1">
                      <FaPlay className="text-[9px]" /> VID
                    </span>
                  )}

                  {/* Overlay sélection */}
                  {isActive && (
                    <span className="absolute inset-0 bg-black/35 border-2 border-blue-500 pointer-events-none" />
                  )}

                  {/* Case à cocher en mode multi */}
                  {multiMode && (
                    <span
                      className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive
                          ? "bg-blue-500"
                          : "bg-black/60 border border-white/50"
                      }`}
                    >
                      {isActive ? <FaCheck /> : ""}
                    </span>
                  )}

                  {/* Ordre de sélection (1,2,3,...) en mode multi */}
                  {multiMode && order && (
                    <span className="absolute bottom-1 right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-600">
                      {order}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
