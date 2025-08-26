import { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { FaRegPlayCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

function Search() {
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=60")
      .then((res) => {
        const items = res.data.results.map((item, i) => ({
          type: i % 3 === 0 ? "video" : "image",
          url: item.picture.large,
          portrait: i % 5 === 0,
        }));
        setMediaItems(items);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      {/* ✅ Barre de recherche en haut */}
      <div className="h-12 px-4 flex items-center sticky top-0 bg-black z-50 gap-2">
        <div className="flex items-center bg-neutral-800 rounded-full px-4 py-2 w-full">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Rechercher"
            className="bg-transparent outline-none text-sm placeholder-gray-400 w-full"
          />
        </div>
        <BsThreeDots className="text-2xl text-white" />
      </div>

      {/* ✅ Grille qui touche la bottom bar */}
      <div className="columns-3 gap-[2px] px-[1px]">
        {" "}
        {/* pb-14 = hauteur de la bottom navbar */}
        {mediaItems.map((item, i) => (
          <div
            key={i}
            className={`relative w-full overflow-hidden ${
              item.portrait ? "aspect-[9/16]" : "aspect-square"
            }`}
          >
            <img
              src={item.url}
              alt="media"
              className="object-cover w-full h-full"
            />
            {item.type === "video" && (
              <div className="absolute top-1 right-1">
                <FaRegPlayCircle className="text-white text-md" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
