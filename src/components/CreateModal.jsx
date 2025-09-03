import { useRef, useEffect, useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { BiExpandAlt } from "react-icons/bi";
import { FiZoomIn } from "react-icons/fi";
import { CgStack } from "react-icons/cg";
import { LuRectangleVertical, LuRectangleHorizontal } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";

export default function CreateModal({ visible = false, onClose }) {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mediaList, setMediaList] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(null);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showStackOverlay, setShowStackOverlay] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("original");
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Original");
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [fade, setFade] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [temperature, setTemperature] = useState(0);

  const currentMedia = mediaList[currentMediaIndex] || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose?.();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMediaItems = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setMediaList((prev) => {
      const updated = [...prev, ...newMediaItems];
      setCurrentMediaIndex(updated.length - 1);
      return updated;
    });

    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      handleFileChange({ target: { files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resetMedia = () => {
    setMediaList([]);
    setCurrentMediaIndex(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setShowZoomMenu(false);
    setShowRatioMenu(false);
    setShowStackOverlay(false);
  };

  const getRatioStyle = () => {
    switch (selectedRatio) {
      case "1:1":
        return "aspect-square";
      case "4:5":
        return "aspect-[4/5]";
      case "16:9":
        return "aspect-video";
      default:
        return "";
    }
  };

  const getFilterClass = (filter = selectedFilter) => {
    switch (filter) {
      case "Clarendon":
        return "brightness-110 contrast-125";
      case "Crema":
        return "sepia";
      case "Gingham":
        return "brightness-90";
      case "Juno":
        return "saturate-150";
      case "Lark":
        return "brightness-105 contrast-110";
      case "Ludwig":
        return "contrast-125 grayscale";
      case "Moon":
        return "grayscale contrast-110";
      case "Perpetua":
        return "saturate-125";
      case "Reyes":
        return "brightness-95 sepia";
      case "Slumber":
        return "brightness-90 contrast-90";
      case "Aden":
        return "sepia brightness-105";
      default:
        return "";
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    setOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    const maxOffsetX = (zoom - 1) * 350;
    const maxOffsetY = (zoom - 1) * 350;
    const clampedX = Math.max(-maxOffsetX, Math.min(offset.x, maxOffsetX));
    const clampedY = Math.max(-maxOffsetY, Math.min(offset.y, maxOffsetY));
    setOffset({ x: clampedX, y: clampedY });
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;

    if (from === to || from == null || to == null) return;

    const newList = [...mediaList];
    const item = newList.splice(from, 1)[0];
    newList.splice(to, 0, item);

    setMediaList(newList);
    setCurrentMediaIndex(to);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleRemoveMedia = (indexToRemove) => {
    const newList = mediaList.filter((_, i) => i !== indexToRemove);
    setMediaList(newList);
    if (newList.length === 0) {
      setCurrentMediaIndex(null);
      return;
    }
    if (indexToRemove === currentMediaIndex) {
      setCurrentMediaIndex(Math.max(0, indexToRemove - 1));
    } else if (indexToRemove < currentMediaIndex) {
      setCurrentMediaIndex((prev) => prev - 1);
    }
  };

  const ratioOptions = [
    { key: "original", label: "Original", icon: <GoFileMedia size={18} /> },
    { key: "1:1", label: "1:1", icon: <FaRegSquare size={18} /> },
    { key: "4:5", label: "4:5", icon: <LuRectangleVertical size={18} /> },
    { key: "16:9", label: "16:9", icon: <LuRectangleHorizontal size={18} /> },
  ];

  const getFilterStyle = () => {
    let baseFilter = "";

    switch (selectedFilter) {
      case "Clarendon":
        baseFilter = "brightness(1.1) contrast(1.25)";
        break;
      case "Crema":
        baseFilter = "sepia(1)";
        break;
      case "Gingham":
        baseFilter = "brightness(0.9)";
        break;
      case "Juno":
        baseFilter = "saturate(1.5)";
        break;
      case "Lark":
        baseFilter = "brightness(1.05) contrast(1.1)";
        break;
      case "Ludwig":
        baseFilter = "contrast(1.25) grayscale(1)";
        break;
      case "Moon":
        baseFilter = "grayscale(1) contrast(1.1)";
        break;
      case "Perpetua":
        baseFilter = "saturate(1.25)";
        break;
      case "Reyes":
        baseFilter = "brightness(0.95) sepia(1)";
        break;
      case "Slumber":
        baseFilter = "brightness(0.9) contrast(0.9)";
        break;
      case "Aden":
        baseFilter = "sepia(1) brightness(1.05)";
        break;
      default:
        baseFilter = "";
    }

    const adjustments = `
      brightness(${1 + brightness / 100})
      contrast(${1 + contrast / 100})
      saturate(${1 + saturation / 100})
      sepia(${fade / 100})
      hue-rotate(${temperature * 1.8}deg)
    }))
    `;

    return {
      filter: `${baseFilter} ${adjustments}`,
    };
  };

  const getAdjustmentStyle = () => {
    return {
      filter: `
        brightness(${1 + brightness / 100})
        contrast(${1 + contrast / 100})
        saturate(${1 + saturation / 100})
        sepia(${fade / 100})
        hue-rotate(${temperature * 1.8}deg)

      }))
      `,
    };
  };

  // Si non visible, ne rien rendre
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      {/* CROIX : ferme la modale */}
      <FaTimes
        onClick={onClose}
        className="absolute top-5 right-6 text-white text-2xl cursor-pointer select-none z-50"
      />

      <div ref={containerRef} className="flex flex-col items-center">
        <div className="flex justify-between items-center w-[700px] bg-black text-white px-4 py-2 rounded-t-xl">
          {currentMedia ? (
            <>
              <button
                onClick={() => {
                  if (showFilters) {
                    setShowFilters(false); // ferme l'overlay
                  } else {
                    resetMedia(); // sinon, retour à la sélection
                  }
                }}
              >
                <IoArrowBack className="text-2xl" />
              </button>
              <h2 className="text-md font-semibold">
                {showFilters ? "Modifier" : "Rogner"}
              </h2>
              <span
                onClick={() => setShowFilters(true)}
                className="text-blue-500 font-semibold text-sm cursor-pointer"
              >
                Suivant
              </span>
            </>
          ) : (
            <h2 className="text-md font-semibold text-center w-full">
              Créer une nouvelle publication
            </h2>
          )}
        </div>

        <div
          className="relative bg-[#262626] text-white max-w-[960px] h-[700px] rounded-b-xl shadow-lg flex flex-row overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!currentMedia ? (
            <div className="flex flex-col w-[700px] items-center justify-center gap-4">
              <svg
                aria-label="Icône photo"
                className="text-white"
                fill="none"
                height="77"
                viewBox="0 0 97 77"
                width="96"
              >
                <title>
                  Icône pour représenter le contenu multimédia, comme les images
                  ou les vidéos
                </title>
                <path
                  d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                  fill="currentColor"
                ></path>
                <path
                  d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                  fill="currentColor"
                ></path>
                <path
                  d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                  fill="currentColor"
                ></path>
              </svg>
              <p className="text-lg">
                Faites glisser les photos et les vidéos ici
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-white text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ backgroundColor: "rgb(65, 80, 247)" }}
              >
                Sélectionner sur l’ordinateur
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <>
              <div className="w-[700px] h-full flex items-center justify-center bg-black flex-shrink-0 relative">
                <div
                  className={`relative ${getRatioStyle()} w-full max-w-[700px] bg-neutral-900`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                >
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                    }}
                  >
                    {currentMedia.type === "image" ? (
                      <img
                        src={currentMedia.url}
                        alt="preview"
                        className={`w-full h-full object-cover pointer-events-none ${getFilterClass()}`}
                        style={getFilterStyle()}
                      />
                    ) : (
                      <video
                        src={currentMedia.url}
                        controls
                        className={`w-full h-full object-cover pointer-events-none ${getFilterClass()}`}
                        style={getAdjustmentStyle()}
                      />
                    )}
                  </div>
                </div>

                {mediaList.length > 1 && (
                  <>
                    {currentMediaIndex > 0 && (
                      <button
                        onClick={() => setCurrentMediaIndex((prev) => prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
                      >
                        <FaChevronLeft />
                      </button>
                    )}

                    {currentMediaIndex < mediaList.length - 1 && (
                      <button
                        onClick={() => setCurrentMediaIndex((prev) => prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20"
                      >
                        <FaChevronRight />
                      </button>
                    )}

                    {mediaList.length > 1 && (
                      <div className="absolute bottom-20 flex justify-center w-full gap-2">
                        {mediaList.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i === currentMediaIndex
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* RATIO & ZOOM */}
              {!showFilters && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowRatioMenu(!showRatioMenu)}
                      className="bg-black bg-opacity-60 px-3 py-1 rounded text-lg hover:bg-opacity-80"
                    >
                      <BiExpandAlt />
                    </button>
                    {showRatioMenu && (
                      <div className="absolute bottom-12 left-0 bg-[#2a2a2a] rounded-md w-32 text-sm shadow-lg z-50">
                        {ratioOptions.map(({ key, label, icon }) => (
                          <button
                            key={key}
                            onClick={() => {
                              setSelectedRatio(key);
                              setShowRatioMenu(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 hover:bg-[#3a3a3a] ${
                              selectedRatio === key ? "font-bold" : ""
                            }`}
                          >
                            <span>{label}</span>
                            {icon}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowZoomMenu(!showZoomMenu)}
                      className="bg-black bg-opacity-60 px-3 py-1 rounded text-lg hover:bg-opacity-80"
                    >
                      <FiZoomIn />
                    </button>
                    {showZoomMenu && (
                      <div className="absolute bottom-12 left-0 bg-[#2a2a2a] rounded-md px-4 py-3 w-40 z-50 shadow-md">
                        <input
                          type="range"
                          min="1"
                          max="2"
                          step="0.01"
                          value={zoom}
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="w-full accent-blue-500"
                        />
                        <div className="text-xs text-center text-white mt-1">
                          Zoom: {zoom.toFixed(2)}x
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STACK */}
              {!showFilters && (
                <div className="absolute bottom-4 right-4">
                  <div className="relative">
                    <button
                      onClick={() => setShowStackOverlay(!showStackOverlay)}
                      className="bg-black bg-opacity-60 px-3 py-1 rounded text-lg hover:bg-opacity-80"
                    >
                      <CgStack />
                    </button>

                    {showStackOverlay && (
                      <div className="absolute bottom-12 right-0 bg-[#2a2a2a] rounded-md px-3 py-2 w-60 flex gap-2 overflow-x-auto z-50">
                        {mediaList.map((media, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`relative w-14 h-14 rounded-md overflow-hidden cursor-move border ${
                              currentMediaIndex === index
                                ? "border-blue-500"
                                : "border-transparent"
                            }`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMedia(index);
                              }}
                              className="absolute top-0 right-0 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                            >
                              ×
                            </button>
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt={`mini-${index}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}

                        {/* Bouton + */}
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-14 h-14 flex items-center justify-center bg-[#3a3a3a] rounded-md cursor-pointer"
                        >
                          +
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showFilters && (
                <div className="w-60 h-full bg-[#1c1c1c] p-4 overflow-y-auto border-l border-neutral-700 flex-shrink-0">
                  <div className="flex mb-4 border-b border-neutral-700">
                    <button
                      className={`px-4 py-2 ${
                        !showAdjustments
                          ? "text-white font-semibold border-b-2 border-white"
                          : "text-gray-400"
                      }`}
                      onClick={() => setShowAdjustments(false)}
                    >
                      Filtres
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        showAdjustments
                          ? "text-white font-semibold border-b-2 border-white"
                          : "text-gray-400"
                      }`}
                      onClick={() => setShowAdjustments(true)}
                    >
                      Réglages
                    </button>
                  </div>

                  {!showAdjustments ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "Aden",
                        "Clarendon",
                        "Crema",
                        "Gingham",
                        "Juno",
                        "Lark",
                        "Ludwig",
                        "Moon",
                        "Original",
                        "Perpetua",
                        "Reyes",
                        "Slumber",
                      ].map((filter) => (
                        <div
                          key={filter}
                          onClick={() => setSelectedFilter(filter)}
                          className={`flex flex-col items-center text-xs text-white cursor-pointer ${
                            selectedFilter === filter
                              ? "font-bold text-blue-400"
                              : ""
                          }`}
                        >
                          <div className="w-16 h-16 bg-black rounded-md overflow-hidden">
                            <img
                              src={currentMedia?.url}
                              alt={filter}
                              className={`w-full h-full object-cover ${getFilterClass(
                                filter
                              )}`}
                            />
                          </div>
                          <span className="mt-1">{filter}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {[
                        {
                          label: "Luminosité",
                          value: brightness,
                          setter: setBrightness,
                        },
                        {
                          label: "Contraste",
                          value: contrast,
                          setter: setContrast,
                        },
                        { label: "Fondu", value: fade, setter: setFade },
                        {
                          label: "Saturation",
                          value: saturation,
                          setter: setSaturation,
                        },
                        {
                          label: "Température",
                          value: temperature,
                          setter: setTemperature,
                        },
                      ].map(({ label, value, setter }) => (
                        <div key={label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{label}</span>
                            <span>{value}</span>
                          </div>
                          <input
                            type="range"
                            min={-100}
                            max={100}
                            value={value}
                            onChange={(e) => setter(Number(e.target.value))}
                            className="w-full accent-white"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
