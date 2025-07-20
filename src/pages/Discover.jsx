import { useEffect, useState } from "react";
import { fetchPhotos } from "../services/api"; // ton api.js
import { FaRegPlayCircle } from "react-icons/fa"; // pour simuler une icône vidéo

function Discover() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos(30).then(setPhotos);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Entête "Pour vous" et "Non personnalisé" */}
      <div className="flex space-x-6 mb-4">
        <span className="text-white font-semibold cursor-pointer hover:underline">
          Pour vous
        </span>
        <span className="text-gray-400 cursor-pointer hover:underline">
          Non personnalisé
        </span>
      </div>

      {/* Grille de posts */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <img
              src={photo.urls.small}
              alt={photo.alt_description || "Discover"}
              className="w-full h-full object-cover rounded-sm"
            />
            {/* Pour simuler des vidéos, on peut afficher un petit icône sur certaines */}
            {index % 7 === 0 && (
              <FaRegPlayCircle className="absolute top-2 right-2 text-white text-xl" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
