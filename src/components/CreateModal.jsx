import { useRef, useEffect, useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaRegSquare } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { BiExpandAlt } from "react-icons/bi";
import { FiZoomIn } from "react-icons/fi";
import { CgStack } from "react-icons/cg";
import { LuRectangleVertical, LuRectangleHorizontal } from "react-icons/lu";
import { GoFileMedia } from "react-icons/go";

export default function CreateModal({ onClose }) {
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
  const [vignette, setVignette] = useState(0);

  const currentMedia = mediaList[currentMediaIndex] || null;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
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
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
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

  const getFilterClass = () => {
    switch (selectedFilter) {
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
    if (indexToRemove === currentMediaIndex) {
      setCurrentMediaIndex(0);
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

  const getAdjustmentStyle = () => {
    return {
      filter: `
      brightness(${1 + brightness / 100})
      contrast(${1 + contrast / 100})
      saturate(${1 + saturation / 100})
      sepia(${fade / 100})
      hue-rotate(${temperature * 1.8}deg)
      drop-shadow(0 0 ${Math.abs(vignette)}px rgba(0,0,0,${
        vignette > 0 ? 0.3 : 0
      }))
    `,
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex items-center justify-center">
      <FaTimes
        onClick={onClose}
        className="absolute top-5 right-6 text-white text-2xl cursor-pointer select-none z-50"
      />

      <div ref={containerRef} className="flex flex-col items-center">
        <div className="flex justify-between items-center w-full bg-black text-white px-4 py-2 rounded-t-xl">
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
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg">
                Faites glisser les photos et les vidéos ici
              </p>
              <button
                onClick={() => fileInputRef.current.click()}
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
                        style={getAdjustmentStyle()}
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
                        {
                          label: "Vignette",
                          value: vignette,
                          setter: setVignette,
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
