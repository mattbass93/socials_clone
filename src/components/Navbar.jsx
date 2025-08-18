import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CreateModal from "./CreateModal";
import MoreMenu from "./MoreMenu";
import SearchOverlay from "./SearchOverlay";
import NotificationsOverlay from "./NotificationsOverlay";

import {
  FiHome,
  FiSearch,
  FiCompass,
  FiFilm,
  FiSend,
  FiPlusSquare,
  FiUser,
  FiAtSign,
} from "react-icons/fi";
import { FaRegHeart, FaRegCircle, FaInstagram } from "react-icons/fa";
import { HiMenu, HiOutlineViewGridAdd } from "react-icons/hi";

function Navbar() {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    const updateCondensed = () => {
      const shouldCondense =
        window.innerWidth < 1335 || location.pathname === "/messages";
      setIsCondensed(shouldCondense);
    };

    updateCondensed(); // appel initial

    window.addEventListener("resize", updateCondensed);
    return () => window.removeEventListener("resize", updateCondensed);
  }, [location.pathname]);

  const linkClasses = ({ isActive }) =>
    `flex items-center  py-2 space-x-3 transition rounded-md transition-colors duration-150 ease-in-out ${
      isActive ? "font-bold" : ""
    }  hover:bg-[#262626]`;

  const iconStyle = (isActive) => ({
    strokeWidth: isActive ? 4 : 2,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className={`${
          isCondensed ? "w-[72px] items-center" : "w-[245px]"
        } h-screen fixed top-0 left-0 border-r border-gray-700 p-3 flex flex-col space-y-6 bg-black text-white pt-10 pb-10 justify-between z-40 transition-all duration-300`}
      >
        <div className="ml-1">
          <NavLink to="/">
            {!isCondensed ? (
              <FaInstagram className="text-2xl font-bold mb-10" />
            ) : (
              <FaInstagram className="text-2xl font-bold mb-10" />
            )}
          </NavLink>

          <nav className="flex flex-col space-y-3 text-lg">
            <NavLink to="/" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <FiHome className="text-2xl" style={iconStyle(isActive)} />
                  {!isCondensed && <span>Accueil</span>}
                </>
              )}
            </NavLink>

            <div
              onClick={() => {
                setShowSearch((prev) => !prev);
                setShowNotifications(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (setShowSearch((prev) => !prev), setShowNotifications(false))
              }
              className={`flex items-center space-x-3 py-2 rounded-md cursor-pointer transition-colors duration-150 ease-in-out ${
                showSearch ? "font-bold text-white-400" : ""
              }hover:bg-[#262626]`}
            >
              <FiSearch className="text-2xl" />
              {!isCondensed && <span>Recherche</span>}
            </div>

            <NavLink to="/discover" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <FiCompass className="text-2xl" style={iconStyle(isActive)} />
                  {!isCondensed && <span>Découvrir</span>}
                </>
              )}
            </NavLink>

            <NavLink to="/reels" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <FiFilm className="text-2xl" style={iconStyle(isActive)} />
                  {!isCondensed && <span>Reels</span>}
                </>
              )}
            </NavLink>

            <NavLink to="/messages" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <FiSend className="text-2xl" style={iconStyle(isActive)} />
                  {!isCondensed && <span>Messages</span>}
                </>
              )}
            </NavLink>

            <div
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowSearch(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (setShowNotifications((prev) => !prev), setShowSearch(false))
              }
              className={`flex items-center space-x-3 py-2 cursor-pointer transition rounded-md transition-colors duration-150 ease-in-out ${
                showNotifications ? "font-bold text-pink-400" : ""
              }hover:bg-[#262626]`}
            >
              <FaRegHeart className="text-2xl" />
              {!isCondensed && <span>Notifications</span>}
            </div>

            <div
              onClick={() => setShowModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
              className="flex items-center space-x-3 py-2 cursor-pointer transition rounded-md transition-colors duration-150 ease-in-out hover:bg-[#262626]"
            >
              <FiPlusSquare className="text-2xl" />
              {!isCondensed && <span>Créer</span>}
            </div>

            <NavLink to="/profile" className={linkClasses}>
              {({ isActive }) => (
                <>
                  <FiUser className="text-2xl" style={iconStyle(isActive)} />
                  {!isCondensed && <span>Profil</span>}
                </>
              )}
            </NavLink>
          </nav>
        </div>

        <nav className="flex flex-col space-y-3 text-lg ml-1">
          <NavLink to="/meta_ai" className={linkClasses}>
            {({ isActive }) => (
              <>
                <FaRegCircle className="text-2xl" style={iconStyle(isActive)} />
                {!isCondensed && <span className="truncate">Meta AI</span>}
              </>
            )}
          </NavLink>
          <NavLink to="/ai_studio" className={linkClasses}>
            {({ isActive }) => (
              <>
                <HiOutlineViewGridAdd
                  className="text-2xl"
                  style={iconStyle(isActive)}
                />
                {!isCondensed && <span>AI Studio</span>}
              </>
            )}
          </NavLink>
          <NavLink to="/threads" className={linkClasses}>
            {({ isActive }) => (
              <>
                <FiAtSign className="text-2xl" style={iconStyle(isActive)} />
                {!isCondensed && <span>Threads</span>}
              </>
            )}
          </NavLink>

          <div className="relative">
            <div className="relative" ref={moreMenuRef}>
              <div
                onClick={() => setShowMoreMenu((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setShowMoreMenu((prev) => !prev)
                }
                className={`flex items-center space-x-3 py-2 cursor-pointer transition rounded-md transition-colors duration-150 ease-in-out ${
                  showMoreMenu ? "font-bold" : ""
                }hover:bg-[#262626]`}
              >
                <HiMenu className="text-2xl" />
                {!isCondensed && <span>Plus</span>}
              </div>

              {showMoreMenu && (
                <MoreMenu onClose={() => setShowMoreMenu(false)} />
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Modales flottantes */}
      {showModal && <CreateModal onClose={() => setShowModal(false)} />}
      {showSearch && (
        <SearchOverlay
          visible={showSearch}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showNotifications && <NotificationsOverlay />}
    </>
  );
}

export default Navbar;
