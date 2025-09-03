import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiLogOut, FiChevronRight } from "react-icons/fi";
import { BsBell, BsShieldCheck } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function SettingsAndActivity() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen md:ml-[9%] xl:ml-[19%] 2xl:ml-[16%] bg-black text-white">
      {/* ✅ Barre fixe en haut */}
      <div className="h-14 px-4 flex items-center justify-start bg-black z-50 gap-[30%] border-b border-gray-800">
        {/* Bouton de retour arrière */}
        <button
          className="text-2xl"
          onClick={() => navigate(-1)} // Retourne à la page précédente
        >
          <IoArrowBack />
        </button>
        <h1 className="text-md font-bold">Paramètres et Activités</h1>
      </div>

      <div className="px-4 py-6 space-y-6 md:max-w-[90%] xl:max-w-[80%]">
        {/* Paramètres */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
            Paramètres
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between bg-[#121212] p-4 rounded-md">
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-xl text-gray-400" />
                <span>Modifier le profil</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </li>
            <li className="flex items-center justify-between bg-[#121212] p-4 rounded-md">
              <div className="flex items-center gap-3">
                <BsBell className="text-xl text-gray-400" />
                <span>Notifications</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </li>
            <li className="flex items-center justify-between bg-[#121212] p-4 rounded-md">
              <div className="flex items-center gap-3">
                <BsShieldCheck className="text-xl text-gray-400" />
                <span>Confidentialité et sécurité</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </li>
            <li className="flex items-center justify-between bg-[#121212] p-4 rounded-md">
              <div className="flex items-center gap-3">
                <FiLogOut className="text-xl text-gray-400" />
                <span>Se déconnecter</span>
              </div>
              <FiChevronRight className="text-gray-500" />
            </li>
          </ul>
        </section>

        {/* Activités Récentes */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
            Activités Récentes
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 bg-[#121212] p-4 rounded-md">
              <FaUserCircle className="text-2xl text-pink-500" />
              <div>
                <p className="text-sm">
                  <span className="font-semibold">john_doe</span> a aimé votre
                  photo.
                </p>
                <span className="text-xs text-gray-500">Il y a 2 heures</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-[#121212] p-4 rounded-md">
              <FaUserCircle className="text-2xl text-blue-500" />
              <div>
                <p className="text-sm">
                  <span className="font-semibold">jane_doe</span> a commencé à
                  vous suivre.
                </p>
                <span className="text-xs text-gray-500">Il y a 5 heures</span>
              </div>
            </li>
            <li className="flex items-start gap-3 bg-[#121212] p-4 rounded-md">
              <MdNotificationsActive className="text-2xl text-yellow-500" />
              <div>
                <p className="text-sm">
                  Vos paramètres de notifications ont été mis à jour.
                </p>
                <span className="text-xs text-gray-500">Il y a 1 jour</span>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default SettingsAndActivity;
