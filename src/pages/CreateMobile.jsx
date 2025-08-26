import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { fetchPhotos, fetchVideos } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateMobile() {
  const [gallery, setGallery] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadMedia() {
      try {
        const [photos, videos] = await Promise.all([
          fetchPhotos(15),
          fetchVideos(5),
        ]);

        const formattedPhotos = photos.map((p) => ({
          type: "image",
          url: p.urls.full,
          thumb: p.urls.small,
        }));

        const formattedVideos = videos.map((v) => ({
          type: "video",
          url:
            v.video_files.find((f) => f.quality === "sd")?.link ||
            v.video_files[0]?.link,
          thumb: v.image,
        }));

        const medias = [...formattedPhotos, ...formattedVideos];
        setGallery(medias);
        if (medias.length > 0) setSelected(medias[0]);
      } catch (err) {
        console.error("Erreur chargement médias :", err);
      }
    }

    loadMedia();
  }, []);

  return (
    // ✅ Plein écran au PREMIER PLAN (recouvre la BottomBar et tout padding)
    <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col overflow-hidden">
      {/* Topbar locale */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-neutral-800 bg-black">
        <button onClick={() => navigate(-1)}>
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-md font-semibold">Nouvelle publication</h2>
        <button className="text-blue-500 font-semibold text-sm">Suivant</button>
      </div>

      {/* Zone centrale: preview (prend tout l’espace entre topbar et galerie) */}
      <div className="flex-1 relative bg-black">
        {selected ? (
          selected.type === "image" ? (
            <img
              src={selected.url}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              src={selected.url}
              controls
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Choisis une photo ou vidéo
          </div>
        )}
      </div>

      {/* Galerie (scrollable en interne), reste DANS l’overlay */}
      <div className="bg-black border-t border-neutral-800 max-h-[35vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-sm">Récent ▾</span>
          <button className="text-xs border px-2 py-1 rounded-md border-gray-600">
            SÉLECTION MULTIPLE
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[1px]">
          {gallery.map((item, i) => (
            <button
              key={i}
              type="button"
              className="relative aspect-square"
              onClick={() => setSelected(item)}
            >
              <img
                src={item.thumb}
                alt=""
                className="w-full h-full object-cover"
              />
              {selected?.url === item.url && (
                <span className="absolute inset-0 bg-black/40 border-2 border-blue-500 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
