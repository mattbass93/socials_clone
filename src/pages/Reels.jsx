import { useEffect, useState } from "react";
import {
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import { faker } from "@faker-js/faker";
import { FiSend } from "react-icons/fi";
import { fetchVideos, fetchUsers } from "../services/api"; // adapte le chemin si besoin

export default function Reels() {
  const [activeTab, setActiveTab] = useState("suggestions");
  const [reelsData, setReelsData] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [videos, users] = await Promise.all([
          fetchVideos(10),
          fetchUsers(10),
        ]);
        const reels = videos.map((video, i) => ({
          id: video.id,
          url:
            video.video_files.find((f) => f.quality === "sd")?.link ||
            video.video_files[0]?.link,
          title: faker.lorem.words(4),
          description: faker.lorem.sentence(),
          audio: `${faker.word.adjective()} · Audio`,
          user: {
            username: users[i % users.length].login.username,
            avatar: users[i % users.length].picture.thumbnail,
          },
          likes: faker.number.int({ min: 100, max: 1000 }) + "K",
          comments: faker.number.int({ min: 10, max: 500 }),
        }));
        setReelsData(reels);
      } catch (error) {
        console.error("Erreur lors du chargement des Reels :", error);
      }
    }

    loadData();
  }, []);

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden">
      {/* Onglets en haut à gauche */}
      <div className="absolute top-4 left-6 z-50 flex gap-5 text-sm font-semibold">
        <button
          className={`pb-1 ${
            activeTab === "suggestions"
              ? "border-b-2 border-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("suggestions")}
        >
          Suggestions
        </button>
        <button
          className={`pb-1 ${
            activeTab === "followed"
              ? "border-b-2 border-white"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("followed")}
        >
          Suivi(e)
        </button>
      </div>

      {/* Reels en plein écran avec scroll vertical */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {reelsData.map((reel) => (
          <div
            key={reel.id}
            className="h-screen w-full flex justify-center items-center snap-start"
          >
            <div className="flex justify-center gap-2 w-full">
              {/* Vidéo verticale */}
              <div className="relative h-[80vh] aspect-[9/16] flex-shrink-0 bg-black">
                <video
                  src={reel.url}
                  controls
                  autoPlay
                  muted
                  loop
                  className="h-full w-full rounded-md object-cover"
                />

                {/* Infos bas gauche */}
                <div className="absolute bottom-4 left-4 text-sm space-y-1 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <img
                      src={reel.user.avatar}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-semibold">{reel.user.username}</span>
                    <button className="text-blue-500 text-xs font-semibold ml-2">
                      Suivre
                    </button>
                  </div>
                  <p className="text-sm">{reel.description}</p>
                  <p className="text-xs text-gray-400">{reel.audio}</p>
                </div>
              </div>

              {/* Colonne latérale droite alignée en bas à l’extérieur */}
              <div className="flex flex-col items-center justify-end pb-4 ml-4">
                <div className="flex flex-col items-center mb-5">
                  <FaRegHeart className=" text-2xl" />
                  <span className="text-xs mt-1">{reel.likes}</span>
                </div>
                <div className="flex flex-col items-center mb-5">
                  <FaRegComment className="text-white text-2xl" />
                  <span className="text-xs mt-1">{reel.comments}</span>
                </div>
                <FiSend className=" text-2xl mb-6" />
                <FaRegBookmark className="text-white text-2xl mb-6" />
                <FaEllipsisH className="text-white text-xl mb-6" />
                <img
                  src={reel.user.avatar}
                  alt="avatar"
                  className="w-8 h-8 border border-white rounded-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
