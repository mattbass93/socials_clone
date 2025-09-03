// SendModal.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { FiX, FiSearch, FiUserPlus, FiLink } from "react-icons/fi";
import { FaWhatsapp, FaFacebook, FaFacebookMessenger } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa6";
import { faker } from "@faker-js/faker";

/* Helpers : nom & avatar */
function getDisplayName(u) {
  if (!u || typeof u !== "object") return "Utilisateur";
  if (u.username) return u.username;
  if (u.login?.username) return u.login.username;
  if (typeof u.name === "string") return u.name;
  if (u.name && typeof u.name === "object") {
    const full = `${u.name.first || ""} ${u.name.last || ""}`.trim();
    if (full) return full;
  }
  if (u.handle) return u.handle;
  if (typeof u.id === "string") return u.id;
  return "Utilisateur";
}
function getAvatarUrl(u) {
  return (
    u?.avatar ||
    u?.photo ||
    u?.image ||
    u?.picture?.medium ||
    u?.picture?.thumbnail ||
    faker.image.avatar()
  );
}
function sampleArray(arr, n) {
  const copy = Array.isArray(arr) ? [...arr] : [];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function SendModal({ onClose, users = [] }) {
  /* Actions rapides */
  const quickActions = useMemo(
    () => [
      { label: "Copier le lien", icon: FiLink },
      { label: "Facebook", icon: FaFacebook },
      { label: "Messenger", icon: FaFacebookMessenger },
      { label: "WhatsApp", icon: FaWhatsapp },
      { label: "Snapchat", icon: FaSnapchat },
    ],
    []
  );

  /* Contacts : générés une seule fois (stables) */
  const contactsRef = useRef(null);
  if (!contactsRef.current) {
    const TARGET = 20;
    if (Array.isArray(users) && users.length > 0) {
      contactsRef.current = sampleArray(
        users,
        Math.min(users.length, TARGET)
      ).map((u, i) => ({
        id: `u-${i}`,
        name: getDisplayName(u),
        img: getAvatarUrl(u),
        online: Math.random() < 0.25,
        badge:
          Math.random() < 0.15
            ? `${faker.number.int({ min: 1, max: 25 })} min`
            : null,
      }));
    } else {
      contactsRef.current = Array.from({ length: TARGET }, (_, i) => ({
        id: `f-${i}`,
        name: faker.internet.userName(),
        img: faker.image.avatar(),
        online: Math.random() < 0.25,
        badge:
          Math.random() < 0.15
            ? `${faker.number.int({ min: 1, max: 25 })} min`
            : null,
      }));
    }
  }
  const contacts = contactsRef.current;

  /* ------ Détection desktop (≥ lg) pour désactiver le bottom-sheet ------ */
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  /* ------- Bottom Sheet (mobile) : hauteur variable + drag ------- */
  const handleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHRef = useRef(0);
  const [sheetHeight, setSheetHeight] = useState(() =>
    Math.round(typeof window !== "undefined" ? window.innerHeight * 0.5 : 400)
  ); // 50% au départ

  // Bornes de snap
  const MIN_H = Math.round(
    typeof window !== "undefined" ? window.innerHeight * 0.35 : 300
  );
  const MID_H = Math.round(
    typeof window !== "undefined" ? window.innerHeight * 0.5 : 400
  );
  const MAX_H = Math.round(
    typeof window !== "undefined" ? window.innerHeight * 1.0 : 800
  );

  useEffect(() => {
    if (isDesktop) return; // pas de drag en desktop
    const handle = handleRef.current;
    if (!handle) return;

    const onTouchStart = (e) => {
      setIsDragging(true);
      startYRef.current = e.touches[0].clientY;
      startHRef.current = sheetHeight;
    };
    const onTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dy = e.touches[0].clientY - startYRef.current; // vers le bas = positif
      let next = startHRef.current - dy; // tirer vers le HAUT -> hauteur augmente
      if (next < 0) next = 0;
      if (next > MAX_H) next = MAX_H;
      setSheetHeight(next);
    };
    const onTouchEnd = () => {
      if (!isDragging) return;
      setIsDragging(false);
      if (sheetHeight < MIN_H) onClose?.();
      else if (sheetHeight > (MID_H + MAX_H) / 2) setSheetHeight(MAX_H);
      else setSheetHeight(MID_H);
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      setIsDragging(true);
      startYRef.current = e.clientY;
      startHRef.current = sheetHeight;

      const onMouseMove = (ev) => {
        if (!isDragging) return;
        const dy = ev.clientY - startYRef.current;
        let next = startHRef.current - dy;
        if (next < 0) next = 0;
        if (next > MAX_H) next = MAX_H;
        setSheetHeight(next);
      };
      const onMouseUp = () => {
        setIsDragging(false);
        if (sheetHeight < MIN_H) onClose?.();
        else if (sheetHeight > (MID_H + MAX_H) / 2) setSheetHeight(MAX_H);
        else setSheetHeight(MID_H);

        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    // Important : touchmove non-passif pour pouvoir preventDefault
    handle.addEventListener("touchstart", onTouchStart, { passive: false });
    handle.addEventListener("touchmove", onTouchMove, { passive: false });
    handle.addEventListener("touchend", onTouchEnd, { passive: true });
    handle.addEventListener("mousedown", onMouseDown);

    return () => {
      handle.removeEventListener("touchstart", onTouchStart);
      handle.removeEventListener("touchmove", onTouchMove);
      handle.removeEventListener("touchend", onTouchEnd);
      handle.removeEventListener("mousedown", onMouseDown);
    };
  }, [isDragging, sheetHeight, onClose, isDesktop, MAX_H, MID_H, MIN_H]);

  const transitionCls =
    !isDesktop && !isDragging
      ? "transition-[height] duration-300 ease-out"
      : "";

  // Padding bas pour que la liste ne passe pas sous le dock fixe (mobile)
  const CONTENT_PB_MOBILE =
    "max(96px, calc(12px + env(safe-area-inset-bottom)))";

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay (clic = fermer) */}
      <div
        className="absolute inset-0 bg-black/60 z-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ====== MOBILE (< lg): bottom sheet ====== */}
      <div
        className={[
          "absolute left-0 right-0 bottom-0 z-10",
          "flex flex-col bg-[#1F2329] text-white rounded-t-3xl shadow-2xl",
          transitionCls,
          "lg:hidden",
        ].join(" ")}
        style={{ height: isDesktop ? undefined : `${sheetHeight}px` }}
      >
        {/* Poignée (drag handle) */}
        <div
          ref={handleRef}
          className="relative pt-2 pb-1 select-none"
          style={{ touchAction: "none" }}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20" />
          <button
            type="button"
            className="absolute right-3 top-1.5 p-2 text-white/60 hover:text-white/90"
            aria-label="Fermer"
            onClick={onClose}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Barre Rechercher */}
        <div className="px-4 pt-2">
          <div className="flex items-center gap-3 rounded-2xl bg-[#2A2F37] px-4 py-2.5">
            <FiSearch className="text-lg text-white/60 shrink-0" />
            <input
              disabled
              className="w-full bg-transparent text-[15px] placeholder-white/45 outline-none"
              placeholder="Rechercher"
            />
            <FiUserPlus className="text-lg text-white/60 shrink-0" />
          </div>
        </div>

        {/* Liste contacts */}
        <div
          className="flex-1 overflow-y-auto px-2 pt-4"
          style={{
            paddingBottom: CONTENT_PB_MOBILE,
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
        >
          <div className="grid grid-cols-3 gap-y-6">
            {contacts.map((c) => (
              <ContactItem key={c.id} c={c} />
            ))}
          </div>
        </div>
      </div>

      {/* Dock d’actions FIXE (mobile) */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 bg-[#1F2329] border-t border-white/10 lg:hidden"
        style={{
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          paddingTop: 8,
        }}
      >
        <div className="mx-auto w-full max-w-md sm:max-w-lg px-2">
          <ActionsRow quickActions={quickActions} />
        </div>
      </div>

      {/* ====== DESKTOP (≥ lg): modal centrée ====== */}
      <div
        className={[
          "hidden lg:flex",
          "absolute inset-0 z-20",
          "items-center justify-center",
        ].join(" ")}
        aria-hidden={!isDesktop}
        onClick={onClose} // clic dans la zone autour de la carte = fermer
      >
        <div
          className={[
            "bg-[#1F2329] text-white rounded-3xl shadow-2xl",
            "w-[720px] max-w-[90vw]",
            "h-[560px] max-h-[85vh]",
            "flex flex-col",
            "border border-white/10",
          ].join(" ")}
          onClick={(e) => e.stopPropagation()} // clic dans la carte = ne pas fermer
        >
          {/* Header avec titre centré + bouton X */}
          <div className="relative px-4 py-3 border-b border-white/10">
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white"
              aria-label="Fermer"
              onClick={onClose}
            >
              <FiX className="text-xl" />
            </button>
            <h3 className="text-center font-semibold">Partager</h3>
          </div>

          {/* Barre de recherche */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#2A2F37] px-4 py-2.5">
              <FiSearch className="text-lg text-white/60 shrink-0" />
              <input
                disabled
                className="w-full bg-transparent text-[15px] placeholder-white/45 outline-none"
                placeholder="Rechercher"
              />
              <FiUserPlus className="text-lg text-white/60 shrink-0" />
            </div>
          </div>

          {/* Liste contacts scrollable */}
          <div className="px-4 pt-4 pb-2 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-y-6">
              {contacts.map((c) => (
                <ContactItem key={c.id} c={c} />
              ))}
            </div>
          </div>

          {/* Barre d’actions interne */}
          <div className="px-4 pb-4">
            <div className="rounded-2xl bg-[#2A2F37] px-3 py-2">
              <ActionsRow quickActions={quickActions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Petits composants ---- */
function ContactItem({ c }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={c.img}
          alt={c.name}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-black/30"
          draggable={false}
        />
        {c.online && (
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1F2329]" />
        )}
        {c.badge && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none">
            {c.badge}
          </span>
        )}
      </div>
      <div className="mt-2 max-w-[120px] truncate text-center text-[13px] leading-tight text-white/90">
        {c.name}
      </div>
    </div>
  );
}

function ActionsRow({ quickActions }) {
  return (
    <div className="flex items-end justify-between gap-2">
      {quickActions.map((item, i) => {
        const IconComp = item.icon;
        return (
          <div
            key={item.label + i}
            className="flex flex-1 min-w-0 flex-col items-center px-1 py-1.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25">
              <IconComp className="text-[18px] text-white" />
            </div>
            <div className="mt-1.5 text-center text-[11px] leading-tight text-white whitespace-nowrap">
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SendModal;
