import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate(); // 👈 pour le bouton retour

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=6")
      .then((res) => {
        const rawUsers = res.data.results;
        const sampleNotifications = [
          {
            section: "7 derniers jours",
            items: [
              {
                user: rawUsers[0],
                type: "channel",
                message: `vous invite à rejoindre son canal : Testament Legions`,
                time: "2 j",
              },
              {
                user: rawUsers[1],
                type: "follow_multi",
                message: `est sur Instagram. madsp69 et une autre personne suivent son compte.`,
                time: "4 j",
              },
              {
                user: rawUsers[2],
                type: "follow_multi",
                message:
                  "et 28 autres personnes suivent votre profil, mais vous ne suivez pas les leurs.",
                time: "4 j",
              },
            ],
          },
          {
            section: "30 derniers jours",
            items: [
              {
                user: rawUsers[3],
                type: "follow_suggested",
                message: "que vous connaissez peut-être, est sur Instagram.",
                time: "2 sem",
              },
              {
                user: rawUsers[4],
                type: "follow_multi",
                message:
                  "et 28 autres personnes suivent votre profil, mais vous ne suivez pas les leurs.",
                time: "2 sem",
              },
              {
                user: rawUsers[5],
                type: "follow_multi",
                message: "est sur Instagram. jeanmichel_even suit son compte.",
                time: "3 sem",
              },
            ],
          },
        ];
        setNotifications(sampleNotifications);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-full min-h-screen bg-black text-white pb-16">
      {/* Header top */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 sticky top-0 bg-black z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)}>
            <FaArrowLeft className="text-white text-xl" />
          </button>
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <span className="text-blue-500 text-sm font-medium cursor-pointer">
          Filtrer
        </span>
      </div>

      <div className="px-4 pt-4">
        {notifications.map((section, sIndex) => (
          <div key={sIndex} className="mb-6">
            <h3 className="text-sm text-gray-400 mb-4">{section.section}</h3>
            <div className="space-y-4">
              {section.items.map((notif, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between hover:bg-[#262626] rounded-lg p-2"
                >
                  {/* Avatar + texte */}
                  <div className="flex items-center space-x-3 flex-1">
                    <img
                      src={notif.user.picture.thumbnail}
                      alt={notif.user.login.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="text-sm leading-tight">
                      <span className="font-semibold mr-1">
                        {notif.user.login.username}
                      </span>
                      {notif.message}
                      <span className="ml-1 text-gray-500">{notif.time}</span>
                    </p>
                  </div>

                  {/* Bouton Suivre */}
                  {notif.type.startsWith("follow") && (
                    <button className="ml-2 bg-white text-black text-sm font-semibold px-3 py-1 rounded">
                      Suivre
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
