import { FiSettings, FiAlertCircle, FiLogOut } from "react-icons/fi";
import { GoGraph } from "react-icons/go";
import { BsBookmark } from "react-icons/bs";
import { MdDarkMode } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";

export default function MoreMenu() {
  const itemClass =
    "flex items-center gap-3 px-4 py-3 hover:bg-[#333] hover:rounded-lg cursor-pointer";
  const logoClass = "text-lg"; // icônes légèrement plus petites

  return (
    <div className="fixed bottom-20 left-4 w-56 bg-[#262626] rounded-xl shadow-lg py-2 z-[100] text-sm text-white border border-[#333]">
      <div className={itemClass}>
        <FiSettings className={logoClass} /> Paramètres
      </div>
      <div className={itemClass}>
        <GoGraph className={logoClass} /> Votre activité
      </div>
      <div className={itemClass}>
        <BsBookmark className={logoClass} /> Enregistrements
      </div>
      <div className={itemClass}>
        <MdDarkMode className={logoClass} /> Changer l’apparence
      </div>
      <div className={itemClass}>
        <FiAlertCircle className={logoClass} /> Signaler un problème
      </div>

      <hr className="my-2 border-[#333]" />

      <div className={itemClass}>
        <HiOutlineSwitchHorizontal className={logoClass} /> Changer de compte
      </div>
      <div className={itemClass}>
        <FiLogOut className={logoClass} /> Déconnexion
      </div>
    </div>
  );
}
